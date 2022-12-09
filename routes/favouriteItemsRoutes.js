const express = require("express");
const router = express.Router();

const favouriteItemsController = require("../controllers/favouriteItemsController");

router.route("/").post(favouriteItemsController.createFavouriteItems);
module.exports = router;
