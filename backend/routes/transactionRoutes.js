const express = require("express");
const Transaction = require("../models/Transaction");

const router = express.Router();

// Add a new transaction
router.post("/", async (req, res) => {
  try {
    const { type, date } = req.body;

    let transaction;
    if (type === "Book") {
      const { books } = req.body;
      transaction = new Transaction({ type, date, books });
    } else {
      const { name, amount, operation } = req.body;
      transaction = new Transaction({ type, date, misc: { name, amount, operation } });
    }

    await transaction.save();
    res.json({ message: "Transaction added successfully", transaction });
  } catch (error) {
    res.status(500).json({ error: "Error adding transaction" });
  }
});

router.get("/", async (req, res) => {
  try {
    const date = req.query.date;
    const transactions = await Transaction.find({ date });

    let totalCost = 0;
    let totalSelling = 0;

    transactions.forEach((txn) => {
      if (txn.type === "Book") {
        txn.books.forEach((book) => {
          totalCost += book.cost;
          totalSelling += book.price;
        });
      } else {
        const amount = txn.misc.amount;
        totalSelling += txn.misc.operation === "Add" ? amount : -amount;
      }
    });

    const profit = totalSelling - totalCost;

    res.json({ transactions, totals: { totalCost, totalSelling, profit } });
  } catch (error) {
    res.status(500).json({ error: "Error fetching transactions" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Transaction.findByIdAndDelete(id);
    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting transaction" });
  }
});


module.exports = router;
