const Order = require("../models/Orders");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const { default: mongoose } = require("mongoose");

const getAllOrdersByUserIdSlug = "/:userId";
const getAllOrdersByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  // const orders = await Order.find({
  //   userId,
  // });
  const userObjectId = mongoose.Types.ObjectId(userId);
  const orders = await Order.aggregate([
    {
      $match: {
        $expr: {
          $and: [{ $eq: ["$userId", userObjectId] }],
        },
      },
    },
    {
      $lookup: {
        from: "users",
        let: { userId: "$userId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ["$$userId", "$_id"] }],
              },
            },
          },
        ],
        as: "user",
      },
    },
    {
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        total: 1,
        address: 1,
        createdAt: 1,
        status: 1,
        userName: "$user.userName",
        telephone: "$user.telephone",
      },
    },
  ]);
  return res.status(200).json(orders);
});

const createOrder = asyncHandler(async (req, res) => {
  const { userId, total, address, telephone } = req.body;
  console.log(req.body);
  if (!userId || !total) {
    return res.status(400).json({
      errorCode: 2,
      message: "All feild is required",
    });
  } else {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    } else {
      const orderObject = { userId, total, address, telephone };
      const newOrder = await Order.create(orderObject);
      if (newOrder) {
        res.status(201).json({
          errorCode: 0,
          message: newOrder._id,
        });
      } else {
        res.status(400).json({
          errorCode: 1,
          message: "Invalid order data received",
        });
      }
    }
  }
});
module.exports = {
  getAllOrdersByUserIdSlug,
  getAllOrdersByUserId,
  createOrder,
};
