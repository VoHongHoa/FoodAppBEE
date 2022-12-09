const FoodItems = require("../models/FoodItems");
const asyncHandler = require("express-async-handler");
const { default: mongoose } = require("mongoose");
const User = require("../models/User");
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
    });
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

const getFoodItemsByCategoryIdSlug = "/findByCategoryId/:categoryId";
const getFoodItemsByCategoryId = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const foodItem = await FoodItems.find({
    categoryID: categoryId,
  });
  return res.json(foodItem);
});

const getLastedFoodItemsSlug = "/find-last-foodItems";
const getLastedFoodItems = asyncHandler(async (req, res) => {
  const { numOfFoodItems } = req.query;
  let lastedFoodItems = [];
  if (numOfFoodItems) {
    lastedFoodItems = await FoodItems.find().limit(numOfFoodItems);
  } else {
    lastedFoodItems = await FoodItems.find().limit(5);
  }
  return res.json(lastedFoodItems);
});

const searchFoodItemsSlug = "/search";
const searchFoodItems = asyncHandler(async (req, res) => {
  const { keyword } = req.query;
  const results = await FoodItems.find({
    $or: [
      { name: { $regex: keyword, $options: "i" } },
      { price: { $regex: keyword, $options: "i" } },
    ],
  });

  return res.status(200).json(results);
});

const likeFoodItemsSlug = "/like-fooditems/:foodItemIParam";
const likeFoodItems = asyncHandler(async (req, res) => {
  const { foodItemIParam } = req.params;
  const { userId } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(400).json({
      errorCode: 1,
      message: "Người dùng không tồn tại",
    });
  }
  const foodItemId = mongoose.Types.ObjectId(foodItemIParam);

  await FoodItems.findByIdAndUpdate(foodItemId, {
    $push: { like: mongoose.Types.ObjectId(userId) },
  });
  await FoodItems.findByIdAndUpdate(foodItemId, {
    $inc: { numOfUserLike: 1 },
  });
  res
    .status(200)
    .json({ errorCode: 0, message: "Yêu thích sản phẩm thành công" });
});

const unlikeFoodItemsSlug = "/unlike-fooditems/:foodItemIParam";
const unlikeFoodItems = asyncHandler(async (req, res) => {
  const { foodItemIParam } = req.params;
  const { userId } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(400).json({
      errorCode: 1,
      message: "Người dùng không tồn tại",
    });
  }
  const foodItemId = mongoose.Types.ObjectId(foodItemIParam);

  await FoodItems.findByIdAndUpdate(foodItemId, {
    $pull: { like: mongoose.Types.ObjectId(userId) },
  });
  await FoodItems.findByIdAndUpdate(foodItemId, {
    $inc: { numOfUserLike: -1 },
  });
  res
    .status(200)
    .json({ errorCode: 0, message: "Bỏ yêu thích sản phẩm thành công" });
});

module.exports = {
  getAllFoodItems,
  createFoodItems,
  getFoodItemByIdSlug,
  getFoodItemById,
  getFoodItemsByCategoryIdSlug,
  getFoodItemsByCategoryId,
  getLastedFoodItemsSlug,
  getLastedFoodItems,
  searchFoodItemsSlug,
  searchFoodItems,
  likeFoodItemsSlug,
  likeFoodItems,
  unlikeFoodItemsSlug,
  unlikeFoodItems,
};
