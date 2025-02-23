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

// Add new supplier
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

// Update balance (Add or Subtract)
exports.updateBalance = async (req, res) => {
  try {
    const { supplierId } = req.params;
    const { amount } = req.body;
    
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) return res.status(404).json({ message: "Supplier not found" });

    supplier.balance += amount;
    supplier.transactions.push({ amount });
    
    await supplier.save();
    res.json(supplier);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete supplier
exports.deleteSupplier = async (req, res) => {
  try {
    const { supplierId } = req.params;
    await Supplier.findByIdAndDelete(supplierId);
    res.json({ message: "Supplier deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
