const Transaction = require("../models/Transaction");

exports.createTransaction = async (req, res) => {
  try {
    const { type, books, sellingPrice, date, name, amount, operation } = req.body;

    let transactionData;
    if (type === "Book") {
      if (!books || books.length === 0 || sellingPrice === undefined) {
        return res.status(400).json({ message: "Books and selling price are required." });
      }
      transactionData = { type, books, sellingPrice, date };
    } else {
      if (!name || !amount || !operation) {
        return res.status(400).json({ message: "All misc transaction details are required." });
      }
      transactionData = { type, misc: { name, amount, operation }, date };
    }

    const transaction = new Transaction(transactionData);
    await transaction.save();
    res.status(201).json({ message: "Transaction saved", transaction });
  } catch (error) {
    res.status(500).json({ message: "Error saving transaction", error });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const { date } = req.query;
    const transactions = await Transaction.find({ date });

    let totalCost = 0;
    let totalSelling = 0;

    transactions.forEach((txn) => {
      if (txn.type === "Book") {
        totalCost += txn.books.reduce((acc, book) => acc + book.cost, 0);
        totalSelling += txn.sellingPrice;
      } else {
        totalSelling += txn.misc.operation === "Add" ? txn.misc.amount : -txn.misc.amount;
      }
    });

    const profit = totalSelling - totalCost;
    res.status(200).json({ transactions, totals: { totalCost, totalSelling, profit } });
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting transaction", error });
  }
};
