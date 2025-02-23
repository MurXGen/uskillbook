const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  balance: { type: Number, required: true, default: 0 },
  transactions: [
    {
      amount: Number,
      date: { type: Date, default: Date.now },
    },
  ],
});

const Supplier = mongoose.model("Supplier", supplierSchema);
module.exports = Supplier;
