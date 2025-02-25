import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const API_BASE_URL = "https://uskillbook.onrender.com/api/suppliers/transactions-by-date";

const TransactionSummary = () => {
  const [transactions, setTransactions] = useState({});

  useEffect(() => {
    axios.get(API_BASE_URL)
      .then(res => setTransactions(res.data))
      .catch(err => console.error("Error fetching transactions:", err));
  }, []);

  return (
    <div className="transaction-summary">
      <h2>Daily Transaction Summary</h2>
      {Object.entries(transactions).length === 0 ? (
        <p>No transactions recorded yet.</p>
      ) : (
        Object.entries(transactions).map(([date, data]) => (
          <motion.div
            key={date}
            className="transaction-day"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3>{new Date(date).toLocaleDateString()}</h3>
            <p><strong>Total Added:</strong> ₹{data.totalAdded}</p>
            <p><strong>Total Subtracted:</strong> ₹{data.totalSubtracted}</p>
            <h4>Suppliers Involved:</h4>
            <ul>
              {data.suppliers.map(supplier => (
                <li key={supplier._id}>{supplier.name}</li>
              ))}
            </ul>
          </motion.div>
        ))
      )}
    </div>
  );
};

export default TransactionSummary;
