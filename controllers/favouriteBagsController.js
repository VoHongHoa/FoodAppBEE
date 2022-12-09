const FavouriteBags = require("../models/FavouriteBags");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const getItemsBagSlug = "/getItemsBag/:userBagIdParam";
const getItemsBag = asyncHandler(async (req, res) => {
  const { userBagIdParam } = req.params;
  const userBagId = mongoose.Types.ObjectId(userBagIdParam);
  const favouriteItems = await FavouriteBags.aggregate([
    {
      $match: {
        $expr: {
          $and: [{ $eq: ["$userId", userBagId] }],
        },
      },
    },
    {
      $lookup: {
        from: "favouriteitems",
        let: {
          bagId: "$_id",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ["$favouriteBagId", "$$bagId"] }],
              },
            },
          },
        ],
        as: "favouriteItems",
      },
    },
    {
      $unwind: {
        path: "$favouriteItems",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        favouriteItemId: "$favouriteItems._id",
        productId: "$favouriteItems.productId",
      },
    },
  ]);
  return res.status(200).json(favouriteItems);
});

module.exports = {
  getItemsBagSlug,
  getItemsBag,
};
