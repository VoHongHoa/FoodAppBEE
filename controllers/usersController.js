const User = require("../models/User");

const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const createNewUser = asyncHandler(async (req, res) => {
  const { userName, password, telephone, address } = req.body;

  if (!userName || !password) {
    return res.status(400).json({ message: "All feilds are required" });
  }

  const duplicate = await User.findOne({
    userName,
  })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  const hashPwd = await bcrypt.hash(password, 10);

  const userObject = { userName, password: hashPwd, telephone, address };

  const user = await User.create(userObject);

  if (user) {
    res.status(201).json({
      message: `New user ${userName} is created`,
    });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { id, userName, telephone, address, password } = req.body;

  if (!id || !userName || !telephone || !address) {
    return res.status(400).json({
      message: "All feilds are required",
    });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({
      message: "User not found",
    });
  }

  const duplicate = await User.findOne({ userName }).lean().exec();

  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate userName" });
  }

  user.userName = userName;
  user.telephone = telephone;
  user.address = address;

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  const updateUser = await user.save();

  return res.json({
    message: `${updateUser.userName} has been updated`,
  });
});
module.exports = {
  createNewUser,
  updateUser,
};
