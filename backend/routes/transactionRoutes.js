const express = require("express");
const Transaction = require("../models/Transaction");

const router = express.Router();

// Add a new transaction
router.post("/", async (req, res) => {
  try {
    const { itemName, cost, sellingPrice, date } = req.body;

    // Check if the item already exists in DB
    let existingItem = await Transaction.findOne({ itemName });

    // If item exists, use stored cost
    if (existingItem) {
      existingItem = existingItem.cost;
    }

    const newTransaction = new Transaction({
      itemName,
      cost: existingItem || cost, // Use existing cost if available
      sellingPrice,
      date
    });

    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error("Error adding transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch all transactions
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Search for existing items by name
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    const items = await Transaction.find({ itemName: { $regex: query, $options: "i" } })
      .limit(5)
      .select("itemName cost");

    res.json(items);
  } catch (error) {
    console.error("Error searching transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;