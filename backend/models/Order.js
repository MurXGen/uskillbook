const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  price: { type: Number, required: true },
  paymentMode: { type: String, required: true },
  buyType: { type: String, required: true },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
