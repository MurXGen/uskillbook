const mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  balance: { type: Number, default: 0 },
  transactions: [
    {
      amount: Number,
      type: { type: String, enum: ["Added", "Subtracted"] },
      reason: { type: String, required: true },
      date: { type: Date, default: Date.now }, // This handles default date if not provided
    }
  ]
});

module.exports = mongoose.model("Supplier", SupplierSchema);
