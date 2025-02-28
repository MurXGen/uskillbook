const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

router.post("/", async (req, res) => {
  try {
    const { items, sellingPrice, date } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "At least one item is required." });
    }

    const newTransaction = new Transaction({
      items,
      sellingPrice,
      date: date || new Date(), // Set current date if not provided
    });

    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error("Transaction save error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
