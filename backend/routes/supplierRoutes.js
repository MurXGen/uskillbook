const express = require("express");
const router = express.Router();
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
    
    // Find supplier
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) return res.status(404).json({ message: "Supplier not found" });

    // Find transaction to delete
    const txnIndex = supplier.transactions.findIndex(txn => txn._id.toString() === txnId);
    if (txnIndex === -1) return res.status(404).json({ message: "Transaction not found" });

    // Deduct transaction amount from balance
    supplier.balance -= supplier.transactions[txnIndex].amount;

    // Remove transaction from array
    supplier.transactions.splice(txnIndex, 1);

    // Save updated supplier
    await supplier.save();

    res.json({ message: "Transaction deleted", supplier });
  } catch (error) {
    res.status(500).json({ message: "Error deleting transaction", error });
  }
});


module.exports = router;
