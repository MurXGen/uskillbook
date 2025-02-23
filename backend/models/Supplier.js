const mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  balance: { type: Number, required: true, default: 0 },
  transactions: [
    {
      amount: Number,
      type: String, // "+" or "-"
      date: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Supplier", SupplierSchema);
