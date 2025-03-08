const Cashflow = require("../models/Cashflow");

// Create a new cashflow order
exports.createCashflow = async (req, res) => {
  try {
    const { orderId, date, items, sellingPrice } = req.body;

    const newCashflow = new Cashflow({
      orderId,
      date,
      items,
      sellingPrice,
    });

    await newCashflow.save();
    res.status(201).json({ message: "Cashflow entry created successfully" });
  } catch (error) {
    console.error("Error saving cashflow:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
