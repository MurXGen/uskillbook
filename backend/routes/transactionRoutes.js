const express = require("express");
const { createTransaction, getTransactions, deleteTransaction } = require("../controllers/transactionController");

const router = express.Router();

router.post("/transactions", createTransaction);
router.get("/transactions", getTransactions);
router.delete("/transactions/:id", deleteTransaction);

module.exports = router;
