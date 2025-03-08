const express = require("express");
const router = express.Router();
const Cashflow = require("../models/Cashflow");
const Book = require("../models/Book");

// Generate 6-digit order ID from date-time
const generateOrderId = () => {
  const now = new Date();
  const orderId = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;
  return orderId.slice(-6); // Take last 6 digits
};

// Submit Cashflow Transaction
router.post("/", async (req, res) => {
  try {
    const { items, sellingPrice } = req.body;
    const orderId = generateOrderId(); // Generate 6-digit ID

    // Save transaction in Cashflow model
    const cashflowEntry = new Cashflow({ orderId, items, sellingPrice });
    await cashflowEntry.save();

    // Check and add books to Book model if they don't exist
    for (let item of items) {
      const existingBook = await Book.findOne({ name: item.name });
      if (!existingBook) {
        const newBook = new Book({ name: item.name, cost: item.cost });
        await newBook.save();
      }
    }

    res.status(201).json({ message: "Cashflow transaction added", orderId, cashflowEntry });
  } catch (error) {
    res.status(500).json({ error: "Error processing cashflow entry" });
  }
});

// Search books by name for suggestions
router.get("/search", async (req, res) => {
  try {
    const query = req.query.query;
    const books = await Book.find({ name: new RegExp(query, "i") }).limit(5);
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Error fetching book suggestions" });
  }
});

module.exports = router;
