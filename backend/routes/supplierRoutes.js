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

router.put("/update", async (req, res) => {
    try {
      const { supplierId, price, operation } = req.body; // Extract data
  
      if (!supplierId || !price || !operation) {
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      // Find supplier
      const supplier = await Supplier.findById(supplierId);
      if (!supplier) {
        return res.status(404).json({ error: "Supplier not found" });
      }
  
      // Update balance based on operation
      if (operation === "add") {
        supplier.balance += price;
      } else if (operation === "subtract") {
        supplier.balance -= price;
      } else {
        return res.status(400).json({ error: "Invalid operation" });
      }
  
      await supplier.save();
      res.status(200).json({ message: "Balance updated successfully", supplier });
  
    } catch (error) {
      console.error("Error updating balance:", error);
      res.status(500).json({ error: "Server error" });
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
