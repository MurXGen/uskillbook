const Order = require("../models/Order");

// Create a new order
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

// Get all orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// Update an order
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Updating Order ID:", id); // Debugging log

    const orderExists = await Order.findById(id);
    if (!orderExists) {
      console.log("Order not found in DB");
      return res.status(404).json({ message: "Order not found" });
    }

    const { price, paymentMode, buyType } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { price, paymentMode, buyType },
      { new: true }
    );

    console.log("Updated Order:", updatedOrder);
    res.status(200).json({ message: "Order updated successfully", order: updatedOrder });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Failed to update order" });
  }
};


// Delete an order
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Failed to delete order" });
  }
};

module.exports = { createOrder, getOrders, updateOrder, deleteOrder };

exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { price, paymentMode, buyType } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { price, paymentMode, buyType },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order updated successfully", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: "Error updating order", error });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting order", error });
  }
};

module.exports = { createOrder , getOrders };
