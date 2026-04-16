const Category = require("../models/category");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    let imageUrl = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;

      // delete local file
      fs.unlinkSync(req.file.path);
    }

    const category = await Category.create({
      name,
      image: imageUrl
    });

    res.json({
      success: true,
      category
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

exports.getCategories = async (req, res) => {
  const categories = await Category.find();

  res.json({
    success: true,
    categories
  });
};