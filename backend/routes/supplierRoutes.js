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
router.get("/transactions-by-date", async (req, res) => {
  try {
    // Fetch all suppliers that have at least one transaction
    const suppliers = await Supplier.find({ "transactions.0": { $exists: true } });

    let transactionsByDate = {};

    suppliers.forEach((supplier) => {
      supplier.transactions.forEach((transaction) => {
        if (!transaction.date) return;

        const date = new Date(transaction.date).toISOString().split("T")[0]; // Format date as YYYY-MM-DD

        // Initialize date if not present
        if (!transactionsByDate[date]) {
          transactionsByDate[date] = {
            totalAdded: 0,
            totalSubtracted: 0,
            suppliers: [],
          };
        }

        // Sum amounts by type
        if (transaction.type === "Added") {
          transactionsByDate[date].totalAdded += transaction.amount;
        } else if (transaction.type === "Subtracted") {
          transactionsByDate[date].totalSubtracted += transaction.amount;
        }

        // Check if supplier is already added for that date
        if (!transactionsByDate[date].suppliers.some(s => s._id.toString() === supplier._id.toString())) {
          transactionsByDate[date].suppliers.push({
            _id: supplier._id,
            name: supplier.name,
          });
        }
      });
    });

    res.json(transactionsByDate);
  } catch (error) {
    console.error("❌ Error fetching transactions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
