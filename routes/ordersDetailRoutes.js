const express = require("express");
const router = express.Router();
const orderDetailsController = require("../controllers/orderDetailsController");

router.route("/").post(orderDetailsController.createOrderDetail);

module.exports = router;
