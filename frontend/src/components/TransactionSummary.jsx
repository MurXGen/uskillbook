import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const API_URL = "https://uskillbook.onrender.com/api/suppliers/transactions-by-date";

const TransactionSummary = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => setTransactions(res.data))
      .catch((err) => console.log("Error fetching transactions:", err));
  }, []);

  return (
    <motion.div
      className="transaction-summary"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Daily Transaction Summary</h2>
      <div className="transaction-list">
        {Object.entries(transactions).map(([date, { added, subtracted }]) => (
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
