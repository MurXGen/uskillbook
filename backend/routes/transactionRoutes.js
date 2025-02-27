const express = require("express");
const Transaction = require("../models/transactionModel");

const router = express.Router();

// Add multiple transactions
router.post("/", async (req, res) => {
  try {
    const transactions = req.body.transactions.map(txn => ({
      ...txn,
      date: txn.date || new Date() // If no date provided, set current date
    }));
    const savedTransactions = await Transaction.insertMany(transactions);
    res.status(201).json(savedTransactions);
  } catch (err) {
    res.status(500).json({ error: "Error saving transactions" });
  }
});

// Get all transactions
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: "Error fetching transactions" });
  }
});

// Search for an item by name
router.get("/search", async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) return res.json([]);
    const results = await Transaction.find({ itemName: new RegExp(query, "i") }).limit(5);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Error searching for items" });
  }
});

module.exports = router;
