import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "../history.css"; // Make sure to create this CSS file

const TransactionHistory = () => {
  const [orders, setOrders] = useState([]);
  const [editOrder, setEditOrder] = useState(null);
  const [updatedData, setUpdatedData] = useState({ price: "", paymentMode: "", buyType: "" });

  // Fetch orders from backend
  useEffect(() => {
    axios.get("https://uskillbook.onrender.com/api/orders")
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => {
        console.error("Error fetching orders:", error);
      });
  }, []);

  // Delete order
  const deleteOrder = async (id) => {
    try {
      await axios.delete(`https://uskillbook.onrender.com/api/orders/${id}`);
      setOrders(orders.filter(order => order._id !== id));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  // Edit order (set data to update)
  const startEdit = (order) => {
    setEditOrder(order._id);
    setUpdatedData({ price: order.price, paymentMode: order.paymentMode, buyType: order.buyType });
  };

  // Update order
  const updateOrder = async () => {
    try {
      const response = await axios.put(
        `https://uskillbook.onrender.com/api/orders/${editOrder}`,
        updatedData,
        { headers: { "Content-Type": "application/json" } }
      );
      setOrders(orders.map(order => (order._id === editOrder ? response.data.order : order)));
      setEditOrder(null);
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  return (
    <div className="transactions-container">
      <h2>Transaction History</h2>
      <div className="transactions-grid">
        {orders.map((order, index) => (
          <motion.div
            key={order._id}
            className="transaction-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <img src={order.imageUrl} alt="Product" className="product-image" />
            {editOrder === order._id ? (
              <>
                <input
                  type="number"
                  value={updatedData.price}
                  onChange={(e) => setUpdatedData({ ...updatedData, price: e.target.value })}
                />
                <select
                  value={updatedData.paymentMode}
                  onChange={(e) => setUpdatedData({ ...updatedData, paymentMode: e.target.value })}
                >
                  <option value="Online Mode">Online Mode</option>
                  <option value="Cash">Cash</option>
                </select>
                <select
                  value={updatedData.buyType}
                  onChange={(e) => setUpdatedData({ ...updatedData, buyType: e.target.value })}
                >
                  <option value="Buy">Buy</option>
                  <option value="Rent">Rent</option>
                </select>
                <button className="save-btn" onClick={updateOrder}>Save</button>
              </>
            ) : (
              <>
                <p><strong>Price:</strong> ₹{order.price}</p>
                <p><strong>Payment Mode:</strong> {order.paymentMode}</p>
                <p><strong>Buy Type:</strong> {order.buyType}</p>
                <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                <div className="card-actions">
                  <button className="edit-btn" onClick={() => startEdit(order)}>Edit</button>
                  <button className="delete-btn" onClick={() => deleteOrder(order._id)}>Delete</button>
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;
