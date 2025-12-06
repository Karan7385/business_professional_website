import express from  'express';

import {
    handle_submit,
    get_enquiries,
    update_enquiry_status
} from '../../controllers/contact/contact_controller.js';

const router = express.Router();

router.post('/submit-enquiries', handle_submit);
router.get('/list-enquiries', get_enquiries);
router.patch('/enquiries/:id/status', update_enquiry_status);

export default router;