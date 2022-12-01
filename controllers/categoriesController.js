const Categories = require("../models/Categories");
const asyncHandler = require("express-async-handler");

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Categories.find().lean().exec();
  return res.json(categories);
});

const createCategory = asyncHandler(async (req, res) => {
  const { categoryName, ImageUrl } = req.body;

  const categoryObject = { categoryName, ImageUrl };
  const newCategory = await Categories.create(categoryObject);
  if (newCategory) {
    res.status(201).json({
      message: `New category is created`,
    })
  } else {
    res.status(400).json({ message: "Invalid category data received" });
  }
});

module.exports = {
  getAllCategories,
  createCategory
};
