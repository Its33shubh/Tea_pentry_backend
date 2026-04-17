const express = require("express");
const router = express.Router();

const {createProduct,getProducts,getProductsByCategory} = require("../controllers/productController");
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

//Create (admin only)
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "super_admin"),
  upload.single("image"),
  createProduct
);

// 📥 Get all
router.get("/", getProducts);

// 📥 Get by category
router.get("/:categoryId", getProductsByCategory);

module.exports = router;