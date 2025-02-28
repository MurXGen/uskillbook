const express = require("express");
const router = express.Router();
const Transaction = require("../models/transactionModel");

// Fetch all transactions
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: "Error fetching transactions" });
  }
});

// Add a new transaction
router.post("/", async (req, res) => {
  try {
    const { items, sellingPrice, date } = req.body;
    const newTransaction = new Transaction({
      items,
      sellingPrice,
      date: date ? new Date(date) : new Date()
    });
    await newTransaction.save();
    res.json({ message: "Transaction saved" });
  } catch (err) {
    res.status(500).json({ error: "Error saving transaction" });
  }
});

module.exports = router;
