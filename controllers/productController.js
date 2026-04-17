const Product = require("../models/product");
const Category = require("../models/category");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

//CREATE PRODUCT
exports.createProduct = async (req, res) => {
    try {
      let { name, price, category } = req.body;
  
      //clean input
      name = name.trim();
      if (!name || !price || !category) {
        return res.status(400).json({
          success: false,
          message: "All fields are required"
        });
      }
      const cat = await Category.findById(category);
      if (!cat) {
        return res.status(400).json({
          success: false,
          message: "Category not found"
        });
      }
  
        // duplicate check
      const existing = await Product.findOne({
        name: { $regex: new RegExp("^" + name + "$", "i") },
        category
      });
  
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Product already exists in this category"
        });
      }
  
      let imageUrl = "";
  
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        imageUrl = result.secure_url;
  
        fs.unlinkSync(req.file.path);
      }
  
      const product = await Product.create({
        name,
        price,
        category,
        image: imageUrl
      });
  
      res.json({
        success: true,
        product
      });
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
}

// GET ALL PRODUCTS
exports.getProducts = async (req, res) => {
  const products = await Product.find().populate("category", "name");

  res.json({
    success: true,
    products
  });
};


//GET BY CATEGORY
exports.getProductsByCategory = async (req, res) => {
  const { categoryId } = req.params;

  const products = await Product.find({ category: categoryId });

    if (products.length === 0)
    {
        return res.status(404).json({
            success: false,
            message: "No product in this category"
          });
    }

  res.json({
    success: true,
    products
  });
};