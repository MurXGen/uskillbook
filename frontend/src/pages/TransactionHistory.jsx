import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const API_URL = "https://uskillbook.onrender.com/api/suppliers/transactions-by-date";

const TransactionSummary = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => {
        const sortedTransactions = Object.entries(res.data).sort(
          ([dateA], [dateB]) => new Date(dateB) - new Date(dateA) // Sort descending
        );
        setTransactions(sortedTransactions);
      })
      .catch((err) => console.log("Error fetching transactions:", err));
  }, []);

  return (
    <motion.div
      className="transaction-summary"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="transaction-list">
        {transactions.map(([date, { added, subtracted }]) => (
          <div key={date} className="transaction-day">
            <h3>{new Date(date).toDateString()}</h3>
            <p><strong>Added:</strong> ₹{added}</p>
            <p><strong>Subtracted:</strong> ₹{subtracted}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default TransactionSummary;
