import express from "express";
import multer from "multer";
import {
  get_products,
  create_product,
  edit_product,
  delete_product,
  get_products_name,
  get_categories_name
} from "../../controllers/products/products_controller.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/products"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = file.originalname.split(".").pop();
    cb(null, `${unique}.${ext}`);
  },
});

const upload = multer({ storage });

router.get("/", get_products);
router.get("/get-products", get_products_name);
router.get("/get-categories", get_categories_name);
// router.get("/popular", get_top_products);
router.post("/", upload.array("images"), create_product);
router.put("/:id", upload.array("images"), edit_product);
router.delete("/:id", delete_product);

export default router;