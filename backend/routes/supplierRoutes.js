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

    console.log("Fetched Suppliers:", suppliers.length);

    let transactionsByDate = {};

    suppliers.forEach(supplier => {
      supplier.transactions.forEach(transaction => {
        console.log("Processing transaction:", transaction); // ✅ Add this log

        if (!transaction.date) {
          console.error("❌ Missing date field in transaction:", transaction);
          return;
        }

        const date = new Date(transaction.date).toISOString().split("T")[0]; 

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

        if (!transactionsByDate[date].suppliers.find(s => s._id.toString() === supplier._id.toString())) {
          transactionsByDate[date].suppliers.push({
            _id: supplier._id,
            name: supplier.name,
          });
        }
      });
    });

    console.log("Final Transactions By Date:", transactionsByDate); // ✅ Debug output

    res.json(transactionsByDate);
  } catch (error) {
    console.error("❌ Error fetching transactions:", error.message, error.stack); // ✅ Proper error log
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
