const Order = require("../models/Order");

const createOrder = async (req, res) => {
  try {
    const { price, paymentMode, buyType } = req.body;

    // Ensure image upload
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "Image file is required" });
    }

    // Get the Cloudinary image URL
    const imageUrl = req.file.path;

    // Validate required fields
    if (!price || !paymentMode || !buyType) {
      return res.status(400).json({ error: "All fields (price, paymentMode, buyType) are required" });
    }

    // Create a new order instance
    const newOrder = new Order({ imageUrl, price, paymentMode, buyType });

    // Save the order to the database
    await newOrder.save();

    // Send response
    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

module.exports = { createOrder };
