const mongoose = require("mongoose");

const FoodItemsSchema = new mongoose.Schema({
  categoryID: {
    type: mongoose.Types.ObjectId,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  imageUrl: {
    type: String,
    require: false,
  },
  description: {
    type: String,
    require: false,
  },
  rating: {
    type: String,
    require: false,
  },
  price: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("FoodItems", FoodItemsSchema);
