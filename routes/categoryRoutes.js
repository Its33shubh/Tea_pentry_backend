const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {createCategory,getCategories} = require("../controllers/categoryController");

const upload = require("../middleware/upload");

router.post( "/", authMiddleware, roleMiddleware("admin", "super_admin"), upload.single("image"), createCategory)
router.get("/", getCategories);

module.exports = router;