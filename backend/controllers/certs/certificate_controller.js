import fs from "fs";
import path from "path";
import {
  get_certificates_model,
  get_certificate_by_id_model,
  create_certificate_model,
  update_certificate_model,
  delete_certificate_model,
} from "../../models/certs/certificate_model.js";

import { create_logs } from "../../models/logs/logs_model.js";

// Helper: save uploaded file to uploads/certificates(/subfolder) and return DB path
async function saveUploadedFile(file, subfolder = "") {
  if (!file) return null;

  const baseDir = path.join(process.cwd(), "uploads", "certificates");
  const uploadDir = subfolder
    ? path.join(baseDir, subfolder)
    : baseDir;

  // Ensure directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const ext = path.extname(file.originalname) || "";
  const baseName = path
    .basename(file.originalname, ext)
    .replace(/\s+/g, "_");

  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const fileName = `${baseName}-${uniqueSuffix}${ext}`;
  const destPath = path.join(uploadDir, fileName);

  // Move from tmp/ to target folder
  await fs.promises.rename(file.path, destPath);

  // Path stored in DB (served statically via /backend/uploads)
  if (subfolder) {
    return `/uploads/certificates/${subfolder}/${fileName}`;
  }
  return `/uploads/certificates/${fileName}`;
}

// Helper: delete file from disk if it exists
async function deleteFileIfExists(srcPath) {
  if (!srcPath) return;

  // srcPath stored in DB probably looks like: /uploads/certificates/xxx.ext
  const normalized = srcPath.startsWith("/")
    ? srcPath.slice(1)
    : srcPath;

  const fullPath = path.join(process.cwd(), normalized);

  try {
    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
    }
  } catch (err) {
    console.error("Error deleting file:", fullPath, err);
  }
}

// GET /api/certs
async function get_certificates(req, res) {
  try {
    const [rows] = await get_certificates_model();

    return res.status(200).json({
      success: true,
      message: "Certificates fetched successfully",
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching certificates:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch certificates",
      data: [],
    });
  }
}

// POST /api/certs  (Create)
async function create_certificate(req, res) {
  const { title, issuer, year, category, color } = req.body;
  const files = req.files || {};

  const certificateFile =
    files.src && files.src[0] ? files.src[0] : null;
  const logoFile =
    files.logo && files.logo[0] ? files.logo[0] : null;

  if (!title || !issuer || !year || !category || !color) {
    // clean up temp files
    for (const f of [certificateFile, logoFile]) {
      if (f && f.path && fs.existsSync(f.path)) {
        await fs.promises.unlink(f.path);
      }
    }

    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  try {
    let finalSrc = null;
    let finalLogo = null;

    if (certificateFile) {
      finalSrc = await saveUploadedFile(certificateFile);
    }

    if (logoFile) {
      finalLogo = await saveUploadedFile(logoFile, "logos");
    }

    const [result] = await create_certificate_model({
      title,
      issuer,
      year,
      src: finalSrc,
      category,
      color,
      logo: finalLogo,
    });

    const newId = result.insertId;

    create_logs(
      "Add Certificate",
      "Fields or Files/images have been changed"
    );

    return res.status(201).json({
      success: true,
      message: "Certificate created successfully",
      data: {
        id: newId,
        title,
        issuer,
        year,
        src: finalSrc,
        category,
        color,
        logo: finalLogo,
      },
    });
  } catch (error) {
    console.error("Error creating certificate:", error);

    // Clean up temp files if still exist
    const allFiles = [certificateFile, logoFile];
    for (const f of allFiles) {
      if (f && f.path && fs.existsSync(f.path)) {
        try {
          await fs.promises.unlink(f.path);
        } catch (cleanupErr) {
          console.error("Error deleting temp file:", cleanupErr);
        }
      }
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create certificate",
    });
  }
}

// PUT /api/certs/:id  (Update)
async function update_certificate(req, res) {
  const { id } = req.params;
  const { title, issuer, year, category, color } = req.body;
  const files = req.files || {};

  const certificateFile =
    files.src && files.src[0] ? files.src[0] : null;
  const logoFile =
    files.logo && files.logo[0] ? files.logo[0] : null;

  if (!id || !title || !issuer || !year || !category || !color) {
    const allFiles = [certificateFile, logoFile];
    for (const f of allFiles) {
      if (f && f.path && fs.existsSync(f.path)) {
        await fs.promises.unlink(f.path);
      }
    }

    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  try {
    // Get existing certificate
    const [rows] = await get_certificate_by_id_model(id);

    if (!rows || rows.length === 0) {
      const allFiles = [certificateFile, logoFile];
      for (const f of allFiles) {
        if (f && f.path && fs.existsSync(f.path)) {
          await fs.promises.unlink(f.path);
        }
      }

      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    const existing = rows[0];
    let finalSrc = existing.src;
    let finalLogo = existing.logo;

    // If new main file uploaded, save it and delete existing file
    if (certificateFile) {
      const newPath = await saveUploadedFile(certificateFile);
      finalSrc = newPath;

      if (existing.src) {
        await deleteFileIfExists(existing.src);
      }
    }

    // If new logo uploaded, save it and delete existing logo file
    if (logoFile) {
      const newLogoPath = await saveUploadedFile(logoFile, "logos");
      finalLogo = newLogoPath;

      if (existing.logo) {
        await deleteFileIfExists(existing.logo);
      }
    }

    const [result] = await update_certificate_model({
      id,
      title,
      issuer,
      year,
      src: finalSrc,
      category,
      color,
      logo: finalLogo,
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    create_logs(
      "Update Certificate",
      "Fields or files/images have been changed"
    )

    return res.status(200).json({
      success: true,
      message: "Certificate updated successfully",
      data: {
        id: Number(id),
        title,
        issuer,
        year,
        src: finalSrc,
        category,
        color,
        logo: finalLogo,
      },
    });
  } catch (error) {
    console.error("Error updating certificate:", error);

    const allFiles = [certificateFile, logoFile];
    for (const f of allFiles) {
      if (f && f.path && fs.existsSync(f.path)) {
        try {
          await fs.promises.unlink(f.path);
        } catch (cleanupErr) {
          console.error("Error deleting temp file:", cleanupErr);
        }
      }
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update certificate",
    });
  }
}

// DELETE /api/certs/:id
async function delete_certificate(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Certificate id is required",
    });
  }

  try {
    const [rows] = await get_certificate_by_id_model(id);

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    const existing = rows[0];

    // Delete files from disk if present
    if (existing.src) {
      await deleteFileIfExists(existing.src);
    }
    if (existing.logo) {
      await deleteFileIfExists(existing.logo);
    }

    const [result] = await delete_certificate_model(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    create_logs(
      "Delete Certificate",
      "Fields or files/images have been changed"
    )

    return res.status(200).json({
      success: true,
      message: "Certificate deleted successfully",
      data: { id: Number(id) },
    });
  } catch (error) {
    console.error("Error deleting certificate:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete certificate",
    });
  }
}

export {
  get_certificates,
  create_certificate,
  update_certificate,
  delete_certificate,
};