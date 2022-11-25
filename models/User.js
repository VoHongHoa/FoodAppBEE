const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  telephone: {
    type: String,
    require: false,
  },
  address: {
    type: String,
    require: false,
  },
});

module.exports = mongoose.model("Users", userSchema);
