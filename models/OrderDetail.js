const mongoose = require("mongoose");

const OrdersSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
  },
  quantity: {
    type: String,
    require: false,
  },
});

module.exports = mongoose.model("OrderDetails", OrdersSchema);
