const mongoose = require("mongoose");

const CashflowSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now },
  items: [
    {
      name: { type: String, required: true },
      cost: { type: Number, required: true },
    },
  ],
  sellingPrice: { type: Number, required: true },
});

module.exports = mongoose.model("Cashflow", CashflowSchema);
