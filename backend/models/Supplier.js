const mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  balance: { type: Number, default: 0 },
  transactions: [
    {
      amount: Number,
      type: { type: String, enum: ["Added", "Subtracted"] },
      date: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model("Supplier", SupplierSchema);
