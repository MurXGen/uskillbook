const express = require("express");
const router = express.Router();
const Supplier = require("../models/Supplier");
const {
  getSuppliers,
  addSupplier,
  updateSupplierBalance,
  deleteSupplier,
} = require("../controllers/supplierController");

router.get("/", getSuppliers);
router.post("/", addSupplier);
router.put("/:id", updateSupplierBalance);
router.delete("/:id", deleteSupplier);
router.delete("/:supplierId/transactions/:txnId", async (req, res) => {
  try {
    const { supplierId, txnId } = req.params;

    // Find the supplier
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    // Find the transaction
    const transactionIndex = supplier.transactions.findIndex(txn => txn._id.toString() === txnId);
    if (transactionIndex === -1) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Subtract transaction amount from supplier balance
    const txnAmount = supplier.transactions[transactionIndex].amount;
    supplier.balance -= txnAmount;

    // Remove the transaction
    supplier.transactions.splice(transactionIndex, 1);

    // Save the updated supplier document
    await supplier.save();

    res.json({ message: "Transaction deleted successfully", supplier });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});


module.exports = router;
