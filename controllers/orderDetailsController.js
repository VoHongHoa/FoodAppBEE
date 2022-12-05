const mongoose = require("mongoose");
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

const getDetailOrderByOrderIdSlug = "/:orderIdParam";
const getDetailOrderByOrderId = asyncHandler(async (req, res) => {
  const { orderIdParam } = req.params;
  const orderId = mongoose.Types.ObjectId(orderIdParam);
  const detailsOrder = await OrderDetail.aggregate([
    {
      $match: {
        $expr: {
          $and: [{ $eq: [orderId, "$orderId"] }],
        },
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
                $and: [{ $eq: ["$$productId", "$_id"] }],
              },
            },
          },
        ],
        as: "ProductOrder",
      },
    },
    {
      $unwind: {
        path: "$ProductOrder",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        productId: 1,
        categoryId: "$ProductOrder.categoryID",
        name: "$ProductOrder.name",
        imageUrl: "$ProductOrder.imageUrl",
        price: "$ProductOrder.price",
        quantity: 1,
      },
    },
    {
      $lookup: {
        from: "categories",
        let: {
          categoryId: "$categoryId",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ["$$categoryId", "$_id"] }],
              },
            },
          },
        ],
        as: "Category",
      },
    },
    {
      $unwind: {
        path: "$Category",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        productId: 1,
        categoryName: "$Category.categoryName",
        name: 1,
        imageUrl: 1,
        price: 1,
        quantity: 1,
      },
    },
  ]);
  return res.status(200).json(detailsOrder);
});
module.exports = {
  createOrderDetail,
  getDetailOrderByOrderId,
  getDetailOrderByOrderIdSlug,
};
