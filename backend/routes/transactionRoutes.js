const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

// ✅ GET all transactions
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ POST a new transaction
router.post("/", async (req, res) => {
  try {
    const { items, sellingPrice, date } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "At least one item is required." });
    }

    const newTransaction = new Transaction({
      items,
      sellingPrice,
      date: date || new Date(),
    });

    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error("Error saving transaction:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Search Transactions by Query
router.get("/search", async (req, res) => {
  try {
    const query = req.query.query; // Get search query from URL
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    // Perform case-insensitive search in transactions
    const transactions = await Transaction.find({
      $or: [
        { items: { $regex: query, $options: "i" } }, // Search in items
        { date: { $regex: query, $options: "i" } } // Search in date
      ]
    });

    res.json(transactions);
  } catch (error) {
    console.error("Error searching transactions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;
