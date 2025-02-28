const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  cost: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Transaction", TransactionSchema);