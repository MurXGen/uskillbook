const Order = require("../models/Order");

// Create Order
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

    res.status(201).json({ message: "✅ Order created successfully", order: newOrder });
  } catch (error) {
    console.error("❌ Order creation error:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

// Get Orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// Update Order
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { price, paymentMode, buyType } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { price, paymentMode, buyType },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "❌ Order not found" });
    }

    res.status(200).json({ message: "✅ Order updated successfully", order: updatedOrder });
  } catch (error) {
    console.error("❌ Error updating order:", error);
    res.status(500).json({ error: "Failed to update order" });
  }
};

// Delete Order
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "❌ Order not found" });
    }

    res.status(200).json({ message: "✅ Order deleted successfully", deletedOrder });
  } catch (error) {
    console.error("❌ Error deleting order:", error);
    res.status(500).json({ message: "Failed to delete order" });
  }
};

module.exports = { createOrder, getOrders, updateOrder, deleteOrder };
