import express from 'express';
import multer from 'multer';

import { edit_jumbotron_controller, get_jumbotron_controller } from '../../controllers/home/jumbotron_home_controller.js';
import { get_tabs_controller, edit_tabs_controller } from '../../controllers/home/tabs_home_controller.js';
import { get_carousel_controller, edit_carousel_controller } from '../../controllers/home/carousel_home_controller.js';

const router = express.Router();

const upload = multer({ dest: 'tmp/' });


// ======================== JUMBOTRON ================================================

router.get(
  '/jumbotron/',
  get_jumbotron_controller
);

router.put(
  '/jumbotron/edit',
  upload.single('backgroundImageFile'),
  edit_jumbotron_controller
);

// ======================== JUMBOTRON ================================================



// ======================== Carousel ================================================

router.get(
  '/carousel',
  get_carousel_controller
);

router.put(
  '/carousel/edit',
  upload.any(),
  edit_carousel_controller
);

// ======================== Carousel ================================================



// ======================== Tabs ================================================

router.get(
  '/tabs',
  get_tabs_controller
);

router.put(
  '/tabs/edit',
  edit_tabs_controller
);

// ======================== TABS ================================================

export default router;