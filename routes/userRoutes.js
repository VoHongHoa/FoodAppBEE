const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

router
  .route("/:id")
  .put(usersController.updateUser);
router
  .route("/")
  .post(usersController.createNewUser)
router.route(usersController.userLoginSlug).post(usersController.userLogin);
module.exports = router;
