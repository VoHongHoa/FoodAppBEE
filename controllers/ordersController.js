const Order = require("../models/Orders");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const { default: mongoose } = require("mongoose");

const getAllOrdersByUserIdSlug = "/:userId";
const getAllOrdersByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  console.log(userId)
  const orders = await Order.find({ userId: mongoose.Types.ObjectId(userId) }).lean().exec();
  return res.json(orders);
});

const createOrder = asyncHandler(async (req, res) => {
  const { userId, total } = req.body;
  if (!userId || !total) {
    return res.status(400).json({
      message: "All feild is required",
    });
  } else {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    } else {
      const orderObject = { userId, total };
      const newOrder = await Order.create(orderObject);
      if (newOrder) {
        res.status(201).json({
          message: `New order is created`,
        });
      } else {
        res.status(400).json({ message: "Invalid order data received" });
      }
    }
  }
});
module.exports = {
  getAllOrdersByUserIdSlug,
  getAllOrdersByUserId,
  createOrder,
};
