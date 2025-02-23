const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  balance: { type: Number, default: 0 },
  transactions: [
    {
      amount: Number,
      date: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Supplier", supplierSchema);
