import express from 'express';
import multer from 'multer';

// IMPORT CONTROLLERS
import { edit_jumbotron_controller, get_jumbotron_controller } from '../../controllers/home/jumbotron_home_controller.js';
import { get_tabs_controller, edit_tabs_controller } from '../../controllers/home/tabs_home_controller.js';
import { get_carousel_controller, edit_carousel_controller } from '../../controllers/home/carousel_home_controller.js';

const router = express.Router();
const upload = multer({ dest: 'tmp/' });

// ======================== JUMBOTRON ================================================

// GET /api/home/
router.get('/jumbotron/', get_jumbotron_controller);

// PUT /api/home/
router.put('/jumbotron/edit', upload.single('backgroundImageFile'), edit_jumbotron_controller);

// ======================== JUMBOTRON ================================================



// ======================== Carousel ================================================

// GET /api/home/
router.get('/carousel', get_carousel_controller);

// PUT /api/home/
router.put('/carousel/edit', upload.any(), edit_carousel_controller);

// ======================== Carousel ================================================



// ======================== Tabs ================================================

// GET /api/home/
router.get('/tabs', get_tabs_controller);

// PUT /api/home/
router.put('/tabs/edit', edit_tabs_controller);

// ======================== TABS ================================================

export default router;