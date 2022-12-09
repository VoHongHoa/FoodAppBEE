const express = require("express");
const router = express.Router();

const favouriteBagsController = require("../controllers/favouriteBagsController");

router
  .route(favouriteBagsController.getItemsBagSlug)
  .get(favouriteBagsController.getItemsBag);
module.exports = router;
