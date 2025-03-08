const express = require("express");
const router = express.Router();
const { createCashflow } = require("../controllers/cashflowController");

// Route to create a new order
router.post("/cashflow", createCashflow);

module.exports = router;
