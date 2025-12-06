import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import {
  get_carousel_home_model,
  edit_carousel_home_model,
} from "../../models/home/carousel_home_model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function get_carousel_controller(req, res) {
  try {
    const [slides] = await get_carousel_home_model();

    console.log("============= CAROUSEL ===============");
    console.log(slides);
    console.log("============= CAROUSEL ===============");
    

    return res.status(200).json({
      data: slides,
    });
  } catch (error) {
    console.error("Error fetching carousel:", error);
    return res.status(500).json({
      message: "Failed to load carousel data",
    });
  }
}

async function edit_carousel_controller(req, res) {
  try {
    let { items } = req.body;
    const files = req.files || [];

    // If items is a JSON string (common with multipart/form-data), parse it
    if (typeof items === "string") {
      items = JSON.parse(items);
    }

    if (!Array.isArray(items)) {
      return res.status(400).json({ message: "Invalid items payload" });
    }

    // Ensure upload directory exists: uploads/home/carousels
    const uploadDir = path.join(process.cwd(), "uploads", "home", "carousels");
    await fs.promises.mkdir(uploadDir, { recursive: true });

    // Attach src to items based on uploaded files
    files.forEach((file) => {
      let index = null;

      // Support both items[0][imageFile] and items[0].imageFile
      let match = file.fieldname.match(/^items\[(\d+)\]\[imageFile\]$/);
      if (!match) {
        match = file.fieldname.match(/^items\[(\d+)\]\.imageFile$/);
      }

      if (match) {
        index = Number(match[1]);
      }

      // Fallback: if we couldn't parse index but number of files == number of items
      if (index === null && files.length === items.length) {
        index = files.indexOf(file);
      }

      if (index == null || !items[index]) return;

      const item = items[index];
      const id = item.id || item.id === 0 ? item.id : null;
      if (id == null) return;

      // Get extension from original file, normalize
      let ext = path.extname(file.originalname).toLowerCase();
      if (ext === ".jpeg") ext = ".jpg"; // optional normalization

      // Final file name: use id + extension (e.g. "1.jpg")
      const finalFileName = String(id) + ext;
      const finalPath = path.join(uploadDir, finalFileName);

      // Move/rename from tmp to final path (overwrite if exists)
      fs.renameSync(file.path, finalPath);

      // Public URL/path to store in DB
      item.src = `/uploads/home/carousels/${finalFileName}`;
    });

    // Normalize items for DB: no undefined values
    const normalizedItems = items
      .filter((item) => item && item.id != null)
      .map((item) => ({
        id: Number(item.id),
        alt: item.alt ?? "",
        label: item.label ?? "",
        // src will be set only if a new file was uploaded, else remains null
        src: item.src ?? null,
      }));

    console.log("NORMALIZED CAROUSEL ITEMS:", normalizedItems);

    // Call model with items
    await edit_carousel_home_model(normalizedItems);

    return res.status(200).json({
      message: "Carousel updated successfully",
    });
  } catch (error) {
    console.error("Error updating carousel:", error);
    return res.status(500).json({
      message: "Failed to update carousel",
    });
  }
}

export { get_carousel_controller, edit_carousel_controller };