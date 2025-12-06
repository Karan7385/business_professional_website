// jumbotron_home_controller.js
import path from "path";
import fs from "fs/promises";

import {
  get_home_jumbotron_model,
  edit_home_jumbotron_model,
} from "../../models/home/jumbotron_home_model.js";

import { create_logs } from "../../models/logs/logs_model.js";

// GET /api/home/jumbotron/get
async function get_jumbotron_controller(req, res) {
  try {
    const [rows] = await get_home_jumbotron_model();

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Jumbotron data not found." });
    }

    console.log("============= JUMBOTRON ===============");
    console.log(rows);
    console.log("============= JUMBOTRON ===============");
    

    return res.status(200).json({ data: rows[0] });
  } catch (err) {
    console.error("Error fetching jumbotron data:", err);
    return res.status(500).json({ message: "Failed to fetch jumbotron data." });
  }
}

// PUT /api/home/jumbotron/edit
async function edit_jumbotron_controller(req, res) {
  const { backgroundAlt, body, intro, title } = req.body;
  const backgroundImageFile = req.file;

  // Validate text fields (image is optional)
  if (!backgroundAlt || !body || !intro || !title) {
    // remove temp file if any
    if (backgroundImageFile?.path) {
      try {
        await fs.unlink(backgroundImageFile.path);
      } catch (err) {
        console.error("Error removing temp file on validation failure:", err);
      }
    }
    return res.status(400).json({ message: "All text fields are required." });
  }

  try {
    // Get current row so we can keep existing image if no new file
    const [rows] = await get_home_jumbotron_model();
    const current = rows && rows[0] ? rows[0] : null;

    let relativeFilePath = current?.background_image || null;

    if (backgroundImageFile) {
      const uploadRoot = path.join(
        process.cwd(),
        "uploads",
        "home",
        "jumbotron"
      );
      await fs.mkdir(uploadRoot, { recursive: true });

      const fileName = "exportImages.jpg"; // overwrite same file always
      const finalPath = path.join(uploadRoot, fileName);

      if (!backgroundImageFile.path) {
        return res
          .status(500)
          .json({ message: "File upload failed: missing temp path." });
      }

      // Remove existing file if present
      try {
        await fs.unlink(finalPath);
      } catch (err) {
        if (err.code !== "ENOENT") {
          console.error("Error removing existing jumbotron image:", err);
        }
      }

      // Move from temp folder to final folder
      await fs.rename(backgroundImageFile.path, finalPath);

      // This is what will be stored in DB and served via /uploads static
      relativeFilePath = path
        .join("uploads", "home", "jumbotron", fileName)
        .replace(/\\/g, "/");
    }

    const [updateResult] = await edit_home_jumbotron_model(
      backgroundAlt,
      body,
      intro,
      title,
      relativeFilePath
    );

    if (!updateResult || updateResult.affectedRows === 0) {
      return res
        .status(500)
        .json({ message: "Failed to update jumbotron in database." });
    }

    create_logs(
      "Edit jumbotron",
      "Fields or images have been changed"
    )

    return res
      .status(200)
      .json({ message: "Jumbotron updated successfully.", data: { backgroundAlt, body, intro, title, background_image: relativeFilePath } });
  } catch (err) {
    console.error("Error updating jumbotron:", err);
    return res.status(500).json({ message: "Failed to update jumbotron." });
  }
}

export {
  get_jumbotron_controller,
  edit_jumbotron_controller,
}; 