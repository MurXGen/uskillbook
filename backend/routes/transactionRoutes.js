const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

// 🟢 Add Transaction (Book or Misc)
router.post("/", async (req, res) => {
  try {
    console.log("Incoming Transaction Data:", req.body); // Debugging

    const { type, books, date, name, amount, operation } = req.body;

    if (!type || !date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let newTransaction;

    if (type === "Book") {
      if (!books || books.length === 0) {
        return res.status(400).json({ message: "No books added" });
      }
      newTransaction = new Transaction({ type, books, date });
    } else {
      if (!name || !amount || !operation) {
        return res.status(400).json({ message: "Missing misc transaction fields" });
      }
      newTransaction = new Transaction({ type, misc: { name, amount, operation }, date });
    }

    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error("Transaction Submission Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// 🟢 Get Transactions by Date
router.get("/", async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const transactions = await Transaction.find({ date });

    // Calculate Totals
    let totalCost = 0, totalSelling = 0, profit = 0;

    transactions.forEach((txn) => {
      if (txn.type === "Book") {
        txn.books.forEach((book) => {
          totalCost += Number(book.cost);
        });
      } else {
        totalSelling += txn.misc.operation === "Add" ? Number(txn.misc.amount) : -Number(txn.misc.amount);
      }
    });

    profit = totalSelling - totalCost;

    res.status(200).json({ transactions, totals: { totalCost, totalSelling, profit } });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/", async (req, res) => {
  const { query } = req.query;
  
  if (!query) return res.status(400).json({ message: "Query is required" });

  try {
    const books = await Book.find({ name: { $regex: query, $options: "i" } }) // Case-insensitive search
      .limit(10); // Limit results for performance

    res.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 🟢 Delete Transaction
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Transaction.findByIdAndDelete(id);
    res.status(200).json({ message: "Transaction deleted" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
