const mongoose = require("mongoose");

const CategoriesSchema = new mongoose.Schema({
  categoryName: {
    type: String,
    require: true,
  },
  categoryPoster: {
    type: String,
    require: false,
  },
  ImageUrl: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("Categories", CategoriesSchema);
