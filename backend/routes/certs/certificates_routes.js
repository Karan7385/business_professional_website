import express from "express";
import multer from "multer";

import {
  get_certificates,
  create_certificate,
  update_certificate,
  delete_certificate,
} from "../../controllers/certs/certificate_controller.js";

const router = express.Router();
const upload = multer({ dest: "tmp/" });

const uploadFields = upload.fields([
  { name: "src", maxCount: 1 },   // main certificate file (image/pdf)
  { name: "logo", maxCount: 1 },  // logo image
]);

// GET /api/certs
router.get("/", get_certificates);

// POST /api/certs (create)
router.post("/", uploadFields, create_certificate);

// PUT /api/certs/:id (update)
router.put("/:id", uploadFields, update_certificate);

// DELETE /api/certs/:id (delete)
router.delete("/:id", delete_certificate);

export default router;