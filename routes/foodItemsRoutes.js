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
module.exports = router;
