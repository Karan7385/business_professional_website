import express from 'express';

import { get_logs_controller } from '../controllers/logs_controller.js';

const router = express.Router();

router.get('/get-logs', get_logs_controller);

export default router;