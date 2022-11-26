const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

router
  .route("/")
  .post(usersController.createNewUser)
  .patch(usersController.updateUser);
router.route(usersController.userLoginSlug).post(usersController.userLogin);
module.exports = router;
