const express = require("express");
const router = express.Router();
const orderDetailsController = require("../controllers/orderDetailsController");

router.route("/").post(orderDetailsController.createOrderDetail);
router
  .route(orderDetailsController.getDetailOrderByOrderIdSlug)
  .get(orderDetailsController.getDetailOrderByOrderId);
module.exports = router;
