const Categories = require("../models/Categories");
const asyncHandler = require("express-async-handler");

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Categories.find().lean().exec();
  return res.json(categories);
});
module.exports = {
  getAllCategories,
};
