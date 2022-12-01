const FoodItems = require("../models/FoodItems");
const asyncHandler = require("express-async-handler");
const getAllFoodItems = asyncHandler(async (req, res) => {
  const foodItems = await FoodItems.find().lean().exec();
  return res.json(foodItems);
});

const createFoodItems = asyncHandler(async (req, res) => {
  const { categoryID, name, imageUrl, price } = req.body;

  const foodItemsObject = { categoryID, name, imageUrl, price };
  const newFoodItems = await FoodItems.create(foodItemsObject);
  if (newFoodItems) {
    res.status(201).json({
      message: `New food items is created`,
    })
  } else {
    res.status(400).json({ message: "Invalid food items data received" });
  }
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
  createFoodItems,
  getFoodItemByIdSlug,
  getFoodItemById,
};
