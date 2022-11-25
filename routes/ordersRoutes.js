const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/ordersController");

router.route("/").post(ordersController.createOrder);
router
  .route(ordersController.getAllOrdersByUserIdSlug)
  .get(ordersController.getAllOrdersByUserId);

module.exports = router;
