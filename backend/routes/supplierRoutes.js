const express = require("express");
const router = express.Router();
const Supplier = require("../models/Supplier");

// Get all suppliers
router.get("/all", async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: "Error fetching suppliers" });
  }
});

// Add a new supplier
router.post("/add", async (req, res) => {
  const { name, balance } = req.body;
  try {
    const newSupplier = new Supplier({ name, balance });
    await newSupplier.save();
    res.status(201).json({ message: "Supplier added" });
  } catch (error) {
    res.status(500).json({ error: "Error adding supplier" });
  }
});

// Update supplier balance
router.put("/update", async (req, res) => {
  const { supplierId, amount } = req.body;
  try {
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) return res.status(404).json({ error: "Supplier not found" });

    supplier.balance += amount;
    supplier.transactions.push({ amount });
    await supplier.save();

    res.json({ message: "Supplier balance updated" });
  } catch (error) {
    res.status(500).json({ error: "Error updating balance" });
  }
});

// Delete supplier
router.delete("/delete/:id", async (req, res) => {
  try {
    await Supplier.findByIdAndDelete(req.params.id);
    res.json({ message: "Supplier deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting supplier" });
  }
});

module.exports = router;
