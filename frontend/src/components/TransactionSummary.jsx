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
      {Object.keys(transactions).length === 0 ? (
        <p>No transactions recorded yet.</p>
      ) : (
        Object.entries(transactions)
          .sort((a, b) => new Date(b[0]) - new Date(a[0])) // Sort by date (latest first)
          .map(([date, data]) => (
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
            
            </motion.div>
          ))
      )}
    </div>
  );
};

export default TransactionSummary;
