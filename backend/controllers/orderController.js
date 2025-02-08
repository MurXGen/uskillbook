const Order = require("../models/Order");

const createOrder = async (req, res) => {
  try {
    // Destructure the fields from the request body
    const { price, paymentMode, buyType } = req.body;

    // Ensure that the image is uploaded
    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    // Generate image URL based on the file's location in the server's 'uploads' directory
    const imageUrl = `/uploads/${req.file.filename}`;

    // Validate the required fields
    if (!price || !paymentMode || !buyType) {
      return res.status(400).json({ error: "All fields (price, paymentMode, buyType) are required" });
    }

    // Create a new order instance
    const newOrder = new Order({ imageUrl, price, paymentMode, buyType });

    // Save the order to the database
    await newOrder.save();

    // Send a response to the frontend with the order data
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
