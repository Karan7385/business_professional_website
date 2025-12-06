import {
    get_product_model,
    create_product_model,
    edit_product_model,
    delete_product_model,
    get_products_name_model,
    get_categories_name_model
} from "../../models/products/products_model.js";
import { create_logs } from "../../models/logs/logs_model.js";

import fs from "fs";
import path from "path";

// helper to safely parse JSON
function safeJsonParse(str, fallback) {
    try {
        if (!str) return fallback;
        return JSON.parse(str);
    } catch {
        return fallback;
    }
}

// delete files from disk given JSON string of ["relative/path1", ...]
function deleteImageFiles(imagesJson) {
    const paths = safeJsonParse(imagesJson, []);
    if (!Array.isArray(paths)) return;

    paths.forEach((relPath) => {
        if (!relPath) return;

        const relativePath = relPath.replace(/^\//, ""); // remove leading slash
        const filePath = path.join(process.cwd(), relativePath);

        fs.unlink(filePath, (err) => {
            if (err && err.code !== "ENOENT") {
                console.error("Error deleting image file:", filePath, err.message);
            }
        });
    });
}

async function get_products(req, res) {
    try {
        const [rows] = await get_product_model();

        // Optionally parse JSON fields so frontend gets arrays
        const products = rows.map((p) => ({
            ...p,
            images: p.images,       // ["uploads/products/..."]
            packaging: p.packaging, // ["FSSAI", "APEDA", ...]
        }));

        return res.status(200).json({
            success: true,
            data: products,
        });
    } catch (error) {
        console.error("Error fetching products:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch products",
        });
    }
}

async function get_products_name(req, res) {
    try {
        const rows = await get_products_name_model();
        
        return res.status(200).json({
            success: true,
            data: rows[0],
        });
    } catch (error) {
        console.error("Error fetching products name:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch products name",
        });
    }
}

async function get_categories_name(req, res) {
    try {
        const [rows] = await get_categories_name_model();

        return res.status(200).json({
            success: true,
            data: rows,
        });
    } catch (error) {
        console.error("Error fetching categories name:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch categories name",
        });
    }
}

async function create_product(req, res) {
    try {
        const {
            name,
            category,
            origin = "",
            grade = "",
            moisture = "",
            min_order_qty = "",
            description = "",
            packaging = "[]", // frontend usually sends JSON.stringify([...])
        } = req.body;

        if (!name || !category) {
            return res.status(400).json({
                success: false,
                message: "Name and category are required",
            });
        }

        // packaging: keep as JSON string if possible; else build from comma-separated
        let packagingJson = "[]";
        try {
            JSON.parse(packaging); // is valid JSON
            packagingJson = packaging;
        } catch {
            const arr = String(packaging)
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
            packagingJson = JSON.stringify(arr);
        }

        // IMAGES: build array of relative paths
        // multer storage should be set to "uploads/products"
        let imagePaths = [];
        if (req.files && req.files.length > 0) {
            imagePaths = req.files.map(
                (file) => `/uploads/products/${file.filename}`
            );
        }
        const imagesJson = JSON.stringify(imagePaths);

        const item = {
            name,
            category,
            origin,
            grade,
            moisture,
            description,
            min_order_qty,
            packaging: packagingJson,
            images: imagesJson,
        };

        const [result] = await create_product_model(item);
        const insertedId = result.insertId;

        // optional logs
        try {
            await create_logs(
                "Add product",
                `Created product: ${name}`
            );
        } catch (logErr) {
            console.error("Failed to create log for product create:", logErr);
        }

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            id: insertedId,
        });
    } catch (error) {
        console.error("Error creating product:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create product",
        });
    }
}

async function edit_product(req, res) {
    try {
        const { id } = req.params;
        const productId = parseInt(id, 10);

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Valid product id is required",
            });
        }

        const {
            name,
            category,
            origin = "",
            grade = "",
            moisture = "",
            min_order_qty = "",
            description = "",
            packaging = null,
            existing_images, // JSON string from frontend (array of strings)
        } = req.body;

        if (!name || !category) {
            return res.status(400).json({
                success: false,
                message: "Name and category are required",
            });
        }

        // Find existing product (for old images + packaging)
        const [rows] = await get_product_model();
        const existing = rows.find((p) => p.id === productId);

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // ---------- PACKAGING ----------
        let packagingJson = existing.packaging || "[]";
        if (packaging !== null && packaging !== undefined) {
            try {
                // if it's already JSON, keep as is
                JSON.parse(packaging);
                packagingJson = packaging;
            } catch {
                // fallback: treat as comma-separated list
                const arr = String(packaging)
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);
                packagingJson = JSON.stringify(arr);
            }
        }

        // ---------- IMAGES ----------
        // existing.images in DB is a JSON string: '["/uploads/products/a.jpg", ...]'
        const originalImages = safeJsonParse(existing.images, []);

        // Frontend sends the remaining images in existing_images
        // when user removed some using the ❌ button.
        let keepImages = safeJsonParse(existing_images, null);

        // If nothing sent or parse failed, default to original images
        if (!Array.isArray(keepImages)) {
            keepImages = originalImages;
        }

        // Determine which images were removed (present before, not in keepImages)
        const removedImages = originalImages.filter(
            (imgPath) => !keepImages.includes(imgPath)
        );

        // Delete only removed image files from disk
        if (removedImages.length > 0) {
            // deleteImageFiles expects a JSON string of array paths, as we wrote earlier
            deleteImageFiles(JSON.stringify(removedImages));
        }

        // Start with the kept images
        let finalImagesArray = [...keepImages];

        // Add new uploaded images (if any)
        if (req.files && req.files.length > 0) {
            const newPaths = req.files.map(
                (file) => `/uploads/products/${file.filename}`
            );
            finalImagesArray = finalImagesArray.concat(newPaths);
        }

        const imagesJson = JSON.stringify(finalImagesArray);

        // ---------- BUILD UPDATE PAYLOAD ----------
        const item = {
            name,
            category,
            origin,
            grade,
            moisture,
            description,
            min_order_qty,
            packaging: packagingJson,
            images: imagesJson,
        };

        await edit_product_model(productId, item);

        try {
            await create_logs(
                "Edit product",
                `Updated product: ${name}`
            );
        } catch (logErr) {
            console.error("Failed to create log for product update:", logErr);
        }

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            id: productId,
        });
    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update product",
        });
    }
}

async function delete_product(req, res) {
    try {
        const { id } = req.params;
        const productId = parseInt(id, 10);

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Valid product id is required",
            });
        }

        const [rows] = await get_product_model();
        const existing = rows.find((p) => p.id === productId);

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // delete image files
        deleteImageFiles(existing.images);

        await delete_product_model(productId);

        try {
            await create_logs(
                "Delete product",
                `Deleted product: ${existing.name}`
            );
        } catch (logErr) {
            console.error("Failed to create log for product delete:", logErr);
        }

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete product",
        });
    }
}

export {
    get_products,
    create_product,
    edit_product,
    delete_product,
    get_products_name,
    get_categories_name
};