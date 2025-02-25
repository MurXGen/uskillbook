const express = require("express");
const router = express.Router();
const {
  getSuppliers,
  addSupplier,
  updateSupplierBalance,
  deleteSupplier,
  getTransactionsByDate,
} = require("../controllers/supplierController");

router.get("/", getSuppliers);
router.post("/", addSupplier);
router.put("/:id", updateSupplierBalance);
router.delete("/:id", deleteSupplier);
router.get("/transactions-by-date", getTransactionsByDate);


module.exports = router;
