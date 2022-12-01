const User = require("../models/User");

const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");

const createNewUser = asyncHandler(async (req, res) => {
  const { userName, password, telephone, address } = req.body;

  console.log(req.body);

  if (!userName || !password) {
    return res.status(400).json({
      errorCode: 1,
      message: "All feilds are required",
    });
  }

  const duplicate = await User.findOne({
    userName,
  })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({
      errorCode: 2,
      message: "Duplicate username",
    });
  }

  const hashPwd = await bcrypt.hash(password, 10);

  const userObject = { userName, password: hashPwd, telephone, address };

  const user = await User.create(userObject);

  if (user) {
    res.status(201).json({
      errorCode: 0,
      message: `New user ${userName} is created`,
    });
  } else {
    res.status(400).json({
      errorCode: 3,
      message: "Invalid user data received",
    });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { password, telephone, address } = req.body;

  if (!telephone || !address || !password) {
    return res.status(400).json({
      message: "All feilds are required",
    });
  }

  const hashPwd = await bcrypt.hash(password, 10);

  const userObject = { password: hashPwd, telephone, address };

  const user = await User.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(id) }, userObject).exec();

  if (!user) {
    return res.status(400).json({
      message: "Update failed",
    });
  }

  // const duplicate = await User.findOne({ userName }).lean().exec();

  // if (duplicate && duplicate?._id.toString() !== id) {
  //   return res.status(409).json({ message: "Duplicate userName" });
  // }

  // user.userName = userName;
  // user.telephone = telephone;
  // user.address = address;

  // if (password) {
  //   user.password = await bcrypt.hash(password, 10);
  // }

  // const updateUser = await user.save();

  return res.json({
    message: `${updateUser.userName} has been updated`,
  });
});

const userLoginSlug = "/login";
const userLogin = asyncHandler(async (req, res) => {
  const { userName, password } = req.body;
  if (!userName || !password) {
    return res.status(400).json({
      errorCode: 1,
      message: "All feild are required",
    });
  } else {
    const user = await User.findOne({
      userName: userName,
    });

    if (!user) {
      return res.status(400).json({
        errorCode: 2,
        message: `userName=${userName} not exist`,
      });
    } else {
      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        return res.status(409).json({
          errorCode: 3,
          message: "password incorrect",
        });
      } else {
        return res.status(200).json(user);
      }
    }
  }
});

module.exports = {
  createNewUser,
  updateUser,
  userLoginSlug,
  userLogin,
};
