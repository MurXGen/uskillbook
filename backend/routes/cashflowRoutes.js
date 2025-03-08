const express = require("express");
const Cashflow = require("../models/Cashflow");
const Book = require("../models/Book");

const router = express.Router();

// Function to generate 6-digit order ID using date and time
const generateOrderId = () => {
  const now = new Date();
  return `${now.getFullYear()}${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}${now
    .getHours()
    .toString()
    .padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}`
    .slice(-6);
};

// Add cashflow transaction
router.post("/", async (req, res) => {
  try {
    const { items, sellingPrice } = req.body;
    const orderId = generateOrderId();
    const date = new Date().toLocaleString();

    // Store cashflow details
    const newTransaction = new Cashflow({
      orderId,
      date,
      items,
      sellingPrice,
    });

    await newTransaction.save();

    // Check if books exist; if not, add them to the book model
    for (const item of items) {
      const existingBook = await Book.findOne({ name: item.name });

      if (!existingBook) {
        const newBook = new Book({
          name: item.name,
          cost: item.cost,
        });
        await newBook.save();
      }
    }

    res.status(201).json({ message: "Transaction recorded successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error recording transaction", error });
  }
});

module.exports = router;
