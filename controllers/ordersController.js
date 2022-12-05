const Order = require("../models/Orders");
const User = require("../models/User");
const OrederDetail = require("../models/OrderDetail");
const FoodItems = require("../models/FoodItems");
const asyncHandler = require("express-async-handler");
const { default: mongoose } = require("mongoose");

const getAllOrdersByUserIdSlug = "/:userParamId";
const getAllOrdersByUserId = asyncHandler(async (req, res) => {
  const { userParamId } = req.params;
  if (typeof userParamId !== "string") {
    return res.status(400).json({
      message: "Bad request",
    });
  }
  //const orders = await Order.find({ userId: mongoose.Types.ObjectId(userId) });
  const userId = mongoose.Types.ObjectId(userParamId);
  const detailOrders = await Order.aggregate([
    {
      $match: {
        $expr: {
          $and: [{ $eq: ["$userId", userId] }],
        },
      },
    },
    {
      $lookup: {
        from: "orderdetails",
        let: {
          orderId: "$_id",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ["$orderId", "$$orderId"] }],
              },
            },
          },
        ],
        as: "AllOrder",
      },
    },
    {
      $unwind: {
        path: "$AllOrder",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        userId: 1,
        orderId: "$AllOrder.orderId",
        productId: "$AllOrder.productId",
        quantity: "$AllOrder.quantity",
      },
    },
    {
      $lookup: {
        from: "fooditems",
        let: {
          productId: "$productId",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ["$_id", "$$productId"] }],
              },
            },
          },
        ],
        as: "DetailProduct",
      },
    },
    {
      $unwind: {
        path: "$DetailProduct",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        orderId: 1,
        quantity: 1,
        productName: "$DetailProduct.name",
        productImg: "$DetailProduct.imageUrl",
        productPrice: "$DetailProduct.price",
      },
    },
  ]);

  return res.json(detailOrders);
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
