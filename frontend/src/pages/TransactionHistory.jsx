import { useEffect, useState } from "react";
import axios from "axios";

const TransactionHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("https://uskillbook.onrender.com/api/orders");
        setOrders(response.data);
      } catch (err) {
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading transaction history...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((order) => (
          <div key={order._id} className="border p-4 rounded-lg shadow-md">
            <img src={order.imageUrl} alt="Purchased Item" className="w-full h-40 object-cover rounded-lg mb-2" />
            <p><strong>Price:</strong> ₹{order.price}</p>
            <p><strong>Buy Type:</strong> {order.buyType}</p>
            <p><strong>Payment Mode:</strong> {order.paymentMode}</p>
            <p><strong>Purchase Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;
