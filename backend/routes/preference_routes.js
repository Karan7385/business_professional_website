import express from "express";

// IMPORT CONTROLLERS
import {
  createPreference,
  getPreferredProducts
} from "../controllers/preference_controller.js";

const router = express.Router();

// POST /api/preferences/
router.post("/", createPreference);

// GET /api/preferences/
router.get("/", getPreferredProducts);

export default router;
