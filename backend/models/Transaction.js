const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  type: { type: String, required: true }, // "Book" or "Misc"
  date: { type: String, required: true },
  books: [
    {
      name: { type: String, required: true },
      cost: { type: Number, required: true },
    },
  ],
  sellingPrice: { type: Number }, // Only one selling price for all books
  misc: {
    name: String,
    amount: Number,
    operation: String,
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
