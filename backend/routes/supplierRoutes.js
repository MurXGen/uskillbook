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
    const suppliers = await Supplier.find({ "transactions.0": { $exists: true } });

    let transactionsByDate = {};

    suppliers.forEach(supplier => {
      supplier.transactions.forEach(transaction => {
        const date = new Date(transaction.date).toISOString().split("T")[0]; // Extract only the date part

        if (!transactionsByDate[date]) {
          transactionsByDate[date] = {
            totalAdded: 0,
            totalSubtracted: 0,
            suppliers: [],
          };
        }

        if (transaction.type === "Added") {
          transactionsByDate[date].totalAdded += transaction.amount;
        } else {
          transactionsByDate[date].totalSubtracted += transaction.amount;
        }

        // Add supplier if not already listed
        if (!transactionsByDate[date].suppliers.find(s => s._id.toString() === supplier._id.toString())) {
          transactionsByDate[date].suppliers.push({
            _id: supplier._id,
            name: supplier.name,
          });
        }
      });
    });

    res.json(transactionsByDate);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




module.exports = router;
