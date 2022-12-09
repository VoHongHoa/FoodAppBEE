const FavouriteItems = require("../models/FavouriteItems");
const FavouriteBags = require("../models/FavouriteBags");
const FoodItem = require("../models/FoodItems");
const asyncHandler = require("express-async-handler");

const createFavouriteItems = asyncHandler(async (req, res) => {
  const { favouriteBagId, productId } = req.body;
  if (!favouriteBagId || !productId) {
    return res.status(400).json({
      errorCode: 1,
      message: "Dữ liệu không chính xác",
    });
  }
  const favouriteBag = await FavouriteBags.findById(favouriteBagId);
  if (!favouriteBag) {
    return res.status(400).json({
      errorCode: 2,
      message: "Giỏ yêu thích không tồn tại!",
    });
  }
  const foodItem = await FoodItem.findById(productId);
  if (!foodItem) {
    return res.status(400).json({
      errorCode: 3,
      message: "Sản phẩm yêu thích không tồn tại",
    });
  }
  const favouriteItemObj = { favouriteBagId, productId };

  const favouriteItem = await FavouriteItems.create(favouriteItemObj);
  if (favouriteItem) {
    return res.status(200).json({
      errorCode: 0,
      message: `Thêm sản phẩm yêu thích thành công`,
    });
  } else {
    return res.status(409).json({
      errorCode: 4,
      errorCode: "Thêm sản phẩm yêu thích không thành công",
    });
  }
});

module.exports = {
  createFavouriteItems,
};
