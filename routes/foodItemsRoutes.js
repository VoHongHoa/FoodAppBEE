const express = require("express");
const router = express.Router();

const foodItemsController = require("../controllers/foodItemsController");

router
  .route("/")
  .get(foodItemsController.getAllFoodItems)
  .post(foodItemsController.createFoodItems);
router
  .route(foodItemsController.getFoodItemByIdSlug)
  .get(foodItemsController.getFoodItemById);
router
  .route(foodItemsController.getFoodItemsByCategoryIdSlug)
  .get(foodItemsController.getFoodItemsByCategoryId);
router
  .route(foodItemsController.getLastedFoodItemsSlug)
  .get(foodItemsController.getLastedFoodItems);
router
  .route(foodItemsController.searchFoodItemsSlug)
  .get(foodItemsController.searchFoodItems);
module.exports = router;
