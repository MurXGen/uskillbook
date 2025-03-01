const Supplier = require("../models/Supplier");

// Get all suppliers
exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a new supplier
exports.addSupplier = async (req, res) => {
  try {
    const { name, balance } = req.body;
    const newSupplier = new Supplier({ name, balance });
    await newSupplier.save();
    res.json(newSupplier);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update supplier balance (Add/Subtract with transaction log and selectable date)
exports.updateSupplierBalance = async (req, res) => {
  try {
    const { amount, reason, date } = req.body;
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) return res.status(404).json({ error: "Supplier not found" });

    const transactionType = amount >= 0 ? "Added" : "Subtracted";
    const transactionDate = date ? new Date(date) : new Date();

    supplier.balance += amount;
    supplier.transactions.push({ amount, type: transactionType, reason, date: transactionDate });

    await supplier.save();
    res.json(supplier);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete supplier
exports.deleteSupplier = async (req, res) => {
  try {
    await Supplier.findByIdAndDelete(req.params.id);
    res.json({ message: "Supplier deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get transactions grouped by date
exports.getTransactionsByDate = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    const transactionsByDate = {};

    suppliers.forEach((supplier) => {
      supplier.transactions.forEach((txn) => {
        const dateKey = new Date(txn.date).toISOString().split("T")[0]; // Format: YYYY-MM-DD
        if (!transactionsByDate[dateKey]) {
          transactionsByDate[dateKey] = { added: 0, subtracted: 0 };
        }

        if (txn.type === "Added") {
          transactionsByDate[dateKey].added += txn.amount;
        } else if (txn.type === "Subtracted") {
          transactionsByDate[dateKey].subtracted += txn.amount;
        }
      });
    });

    // Sort transactions by date (latest first)
    const sortedTransactions = Object.fromEntries(
      Object.entries(transactionsByDate).sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
    );

    res.json(sortedTransactions);
  } catch (err) {
    res.status(500).json({ error: "Error fetching transactions" });
  }
};
