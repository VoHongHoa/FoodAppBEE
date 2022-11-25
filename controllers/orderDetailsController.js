const OrderDetail = require("../models/OrderDetail");
const Order = require("../models/Orders");
const FoodItem = require("../models/FoodItems");
const asyncHandler = require("express-async-handler");

const createOrderDetail = asyncHandler(async (req, res) => {
  const { arrOrderDetail } = req.body;
  if (!arrOrderDetail || !Array.isArray(arrOrderDetail)) {
    return res.status(400).json({
      message: "All feilds are required",
    });
  } else {
    const result = Promise.all(
      arrOrderDetail.map(async (item, index) => {
        const order = await Order.findById(item.orderId);
        const product = await FoodItem.findById(item.productId);
        if (!order || !product) {
          return false;
        } else {
          const orderDetailObject = {
            orderId: item.orderId,
            productId: item.productId,
            quantity: item.quantity,
          };
          const orderDetail = await OrderDetail.create(orderDetailObject);
          if (!orderDetail) {
            return false;
          } else {
            return true;
          }
        }
      })
    );
    if (!(await result).every((i) => i === false)) {
      return res.status(200).json({
        message: "Orderdetails are created ",
      });
    } else {
      return res.status(400).json({ message: "Error" });
    }
  }
});
module.exports = {
  createOrderDetail,
};
