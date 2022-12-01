const express = require("express");
const router = express.Router();

const categoriesController = require("../controllers/categoriesController");

router
    .route("/")
    .get(categoriesController.getAllCategories)
    .post(categoriesController.createCategory)

module.exports = router;
