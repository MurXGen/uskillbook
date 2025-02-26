import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const API_BASE_URL = "https://uskillbook.onrender.com/api/suppliers";

const SupplierList = ({ refresh }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [expandedTxn, setExpandedTxn] = useState(null); // Track expanded transactions

  useEffect(() => {
    axios.get(API_BASE_URL)
      .then(res => setSuppliers(res.data))
      .catch(err => console.log("Error fetching suppliers:", err));
  }, [refresh]);

  const deleteSupplier = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this supplier?");

    if (confirmDelete) {
      const password = prompt("Enter password to confirm deletion:");
      
      if (password === "9731") {
        try {
          await axios.delete(`${API_BASE_URL}/${id}`);
          setSuppliers(suppliers.filter(s => s._id !== id));
        } catch (err) {
          console.log("Error deleting supplier:", err);
        }
      } else {
        alert("Incorrect password! Deletion cancelled.");
      }
    }
  };

  const toggleTxnReason = (index) => {
    setExpandedTxn(expandedTxn === index ? null : index); // Toggle state
  };

  return (
    <div className="supplier-container">
      {suppliers.map((supplier, index) => (
        <motion.div
          key={supplier._id}
          className="supplier-box"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <div className="supplierAction">
            <p>
              <strong>{supplier.name} :</strong>
              <span>₹{supplier.balance}</span>
            </p>
            <span
              onClick={() => deleteSupplier(supplier._id)}
              className="material-symbols-outlined deleteSupplier"
            >
              person_remove
            </span>
          </div>

          <div className="transaction-history">
            {supplier.transactions.length > 0 ? (
              supplier.transactions.map((txn, i) => (
                <div
                  key={i}
                  className="transaction-item"
                  onClick={() => toggleTxnReason(`${supplier._id}-${i}`)}
                >
                  <span className="txn-type">{txn.type || "-"}</span>
                  <span className="txn-amount">₹{txn.amount || "-"}</span>

                  {/* Reason with smooth motion animation */}
                  <motion.span
                    className="txn-reason"
                    initial={{ height: 0, opacity: 0 }}
                    animate={expandedTxn === `${supplier._id}-${i}` ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    "{txn.reason || "-"}"
                  </motion.span>

                  <span className="txn-date">{txn.date ? new Date(txn.date).toLocaleString() : "-"}</span>
                </div>
              ))
            ) : (
              <p>No transactions yet.</p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SupplierList;
