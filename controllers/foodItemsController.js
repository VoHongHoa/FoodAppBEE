const FoodItems = require("../models/FoodItems");
const asyncHandler = require("express-async-handler");
const getAllFoodItems = asyncHandler(async (req, res) => {
  const foodItems = await FoodItems.find().lean().exec();
  return res.json(foodItems);
});

const getFoodItemByIdSlug = "/findById/:id";
const getFoodItemById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const foodItem = await FoodItems.findById(id);
  if (!foodItem) {
    return res.status(404).json({
      message: "Fooditem not found",
    });
  } else {
    return res.json(foodItem);
  }
});

module.exports = {
  getAllFoodItems,
  getFoodItemByIdSlug,
  getFoodItemById,
};
