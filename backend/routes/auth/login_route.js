import express from "express";

// IMPORT CONTROLLERS
import login_controller from "../../controllers/authentication/login_controller.js";
import logout_controller from "../../controllers/authentication/logout_controller.js";

// IMPORT MIDDLEWARE
import rateLimit from "express-rate-limit";

const router = express.Router();

// Basic rate limiter for login to slow brute force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,                  // limit each IP to 20 login requests per window
  message: { error: "Too many login attempts. Please try again later." },
});

// POST /api/auth/login
router.post("/login", loginLimiter, login_controller);
router.post("/logout", logout_controller);

export default router;