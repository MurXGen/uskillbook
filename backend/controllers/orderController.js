const Order = require("../models/Order");

const createOrder = async (req, res) => {
  try {
    const { price, paymentMode, buyType } = req.body;
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "Image file is required" });
    }
    const imageUrl = req.file.path;


    if (!price || !paymentMode || !buyType) {
      return res.status(400).json({ error: "All fields (price, paymentMode, buyType) are required" });
    }

    const newOrder = new Order({ imageUrl, price, paymentMode, buyType });

    await newOrder.save();

    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }); // Fetch orders, sorted by latest
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

module.exports = { createOrder , getOrders };
