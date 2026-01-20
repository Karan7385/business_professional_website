import express from 'express';

// IMPORT CONTROLLERS
import { get_logs_controller } from '../controllers/logs_controller.js';

const router = express.Router();

// LOGS ROUTES

// GET /api/logs/
router.get('/get-logs', get_logs_controller);

export default router;