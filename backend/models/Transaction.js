const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  type: { type: String, enum: ["Book", "Misc"], required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  books: [
    {
      name: String,
      cost: Number,
      price: Number,
    },
  ],
  misc: {
    name: String,
    amount: Number,
    operation: { type: String, enum: ["Add", "Subtract"] },
  },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
