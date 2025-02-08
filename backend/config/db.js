const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  price: { type: Number, required: true },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
