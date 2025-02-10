import React, { useEffect, useState } from "react";
import axios from "axios";

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
    <div className="container">
      <h2>Transaction History</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Image</th>
            <th>Price</th>
            <th>Payment Mode</th>
            <th>Buy Type</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>
                <img src={order.imageUrl} alt="Product" width="50" />
              </td>
              <td>{editOrder === order._id ? (
                <input type="number" value={updatedData.price} onChange={(e) => setUpdatedData({ ...updatedData, price: e.target.value })} />
              ) : order.price}</td>
              <td>{editOrder === order._id ? (
                <select value={updatedData.paymentMode} onChange={(e) => setUpdatedData({ ...updatedData, paymentMode: e.target.value })}>
                  <option value="Online Mode">Online Mode</option>
                  <option value="Cash">Cash</option>
                </select>
              ) : order.paymentMode}</td>
              <td>{editOrder === order._id ? (
                <select value={updatedData.buyType} onChange={(e) => setUpdatedData({ ...updatedData, buyType: e.target.value })}>
                  <option value="Buy">Buy</option>
                  <option value="Rent">Rent</option>
                </select>
              ) : order.buyType}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>
                {editOrder === order._id ? (
                  <button onClick={updateOrder}>Save</button>
                ) : (
                  <button onClick={() => startEdit(order)}>Edit</button>
                )}
                <button onClick={() => deleteOrder(order._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistory;
