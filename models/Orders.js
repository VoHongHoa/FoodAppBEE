const mongoose = require("mongoose");

const OrdersSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      require: true,
    },
    total: {
      type: String,
      require: true,
    },
    address: {
      type: String,
      require: false,
    },
    telephone: {
      type: String,
      require: false,
    },
    status: {
      type: String,
      default: "Chưa giao hàng",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Orders", OrdersSchema);
