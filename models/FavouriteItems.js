const mongoose = require("mongoose");

const FavouriteItems = new mongoose.Schema(
  {
    favouriteBagId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FavouriteItems", FavouriteItems);
