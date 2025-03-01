import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "../history.css"; // Add necessary styles

const TransactionHistory = () => {
  const [orders, setOrders] = useState([]);
  const [editOrder, setEditOrder] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    price: "",
    paymentMode: "",
    buyType: "",
  });

  // Fetch orders from backend
  useEffect(() => {
    axios
      .get("https://uskillbook.onrender.com/api/orders")
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  }, []);

  // Delete order
  const deleteOrder = async (id) => {
    try {
      await axios.delete(`https://uskillbook.onrender.com/api/orders/${id}`);
      setOrders(orders.filter((order) => order._id !== id));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  // Edit order (set data to update)
  const startEdit = (order) => {
    setEditOrder(order._id);
    setUpdatedData({
      price: order.price,
      paymentMode: order.paymentMode,
      buyType: order.buyType,
    });
  };

  // Update order
  const updateOrder = async () => {
    try {
      const response = await axios.put(
        `https://uskillbook.onrender.com/api/orders/${editOrder}`,
        updatedData,
        { headers: { "Content-Type": "application/json" } }
      );
      setOrders(
        orders.map((order) =>
          order._id === editOrder ? response.data.order : order
        )
      );
      setEditOrder(null);
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  return (
    <div className="transaction-container">
      <div className="orders-grid">
        {orders.map((order, index) => (
          <motion.div
            key={order._id}
            className="order-box"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <img src={order.imageUrl} alt="Product" className="order-image" />
            <div className="order-details">
              <p>
                <strong>Price:</strong>{" "}
                {editOrder === order._id ? (
                  <input
                    type="number"
                    value={updatedData.price}
                    onChange={(e) =>
                      setUpdatedData({ ...updatedData, price: e.target.value })
                    }
                  />
                ) : (
                  `₹${order.price}`
                )}
              </p>
              <p>
                <strong>Payment Mode:</strong>{" "}
                {editOrder === order._id ? (
                  <select
                    value={updatedData.paymentMode}
                    onChange={(e) =>
                      setUpdatedData({
                        ...updatedData,
                        paymentMode: e.target.value,
                      })
                    }
                  >
                    <option value="Online Mode">Online Mode</option>
                    <option value="Cash">Cash</option>
                  </select>
                ) : (
                  order.paymentMode
                )}
              </p>
              <p>
                <strong>Buy Type:</strong>{" "}
                {editOrder === order._id ? (
                  <select
                    value={updatedData.buyType}
                    onChange={(e) =>
                      setUpdatedData({
                        ...updatedData,
                        buyType: e.target.value,
                      })
                    }
                  >
                    <option value="Buy">Buy</option>
                    <option value="Rent">Rent</option>
                  </select>
                ) : (
                  order.buyType
                )}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="order-actions">
              {editOrder === order._id ? (
                <button className="save-btn" onClick={updateOrder}>
                  Save
                </button>
              ) : (
                <button className="edit-btn" onClick={() => startEdit(order)}>
                  Edit
                </button>
              )}
              <button className="delete-btn" onClick={() => deleteOrder(order._id)}>
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;
