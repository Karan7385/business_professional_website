import express from 'express';

import {
    handle_submit,
    get_enquiries,
    update_enquiry_status
} from '../../controllers/contact/contact_controller.js';

const router = express.Router();

// POST /api/contact/
router.post('/submit-enquiries', handle_submit);

// GET /api/contact/
router.get('/list-enquiries', get_enquiries);

// PATCH /api/contact/
router.patch('/enquiries/:id/status', update_enquiry_status);

export default router;