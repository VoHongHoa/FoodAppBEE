const mongoose = require("mongoose");

const FavouriteBags = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FavouriteBags", FavouriteBags);
