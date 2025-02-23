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

// Update supplier balance (Add/Subtract with transaction log)
exports.updateSupplierBalance = async (req, res) => {
    try {
      const { amount, reason } = req.body;
      const supplier = await Supplier.findById(req.params.id);
  
      if (!supplier) return res.status(404).json({ error: "Supplier not found" });
  
      const transactionType = amount >= 0 ? "Added" : "Subtracted";
  
      supplier.balance += amount;
      supplier.transactions.push({ amount, type: transactionType, reason });
  
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
