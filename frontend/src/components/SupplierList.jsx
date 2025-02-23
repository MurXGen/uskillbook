import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const API_BASE_URL = "https://uskillbook.onrender.com/api/suppliers";

const SupplierList = ({ refresh }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [expandedTxn, setExpandedTxn] = useState(null);

  useEffect(() => {
    axios.get(API_BASE_URL)
      .then(res => setSuppliers(res.data))
      .catch(err => console.log("Error fetching suppliers:", err));
  }, [refresh]);

  const deleteSupplier = (id) => {
    axios.delete(`${API_BASE_URL}/${id}`)
      .then(() => {
        setSuppliers(suppliers.filter(s => s._id !== id));
      })
      .catch(err => console.log("Error deleting supplier:", err));
  };

  const toggleTxnReason = (index) => {
    setExpandedTxn(expandedTxn === index ? null : index);
  };

  const deleteTransaction = (supplierId, txnId, txnAmount) => {
    axios.delete(`${API_BASE_URL}/${supplierId}/transactions/${txnId}`)
      .then((res) => {
        console.log("Transaction deleted successfully:", res.data);
        
        setSuppliers(prevSuppliers =>
          prevSuppliers.map(supplier => {
            if (supplier._id === supplierId) {
              return {
                ...supplier,
                transactions: supplier.transactions.filter(txn => txn._id !== txnId),
                balance: supplier.balance - txnAmount // Update balance
              };
            }
            return supplier;
          })
        );
      })
      .catch(err => console.log("Error deleting transaction:", err));
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
            <h4>Transaction History:</h4>
            {supplier.transactions.length > 0 ? (
              supplier.transactions.map((txn, i) => (
                <div
                  key={txn._id}
                  className="transaction-item"
                  onClick={() => toggleTxnReason(`${supplier._id}-${txn._id}`)}
                >
                  <span className="txn-type">{txn.type || "-"}</span>
                  <span className="txn-amount">₹{txn.amount || "-"}</span>

                  <motion.span
                    className="txn-reason"
                    initial={{ height: 0, opacity: 0 }}
                    animate={expandedTxn === `${supplier._id}-${txn._id}` ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    "{txn.reason || "-"}"
                  </motion.span>

                  <span className="txn-date">{txn.date ? new Date(txn.date).toLocaleString() : "-"}</span>

                  {/* Delete Transaction Button */}
                  <span
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent expanding on delete click
                      deleteTransaction(supplier._id, txn._id, txn.amount);
                    }}
                    className="material-symbols-outlined deleteTxn"
                  >
                    delete
                  </span>
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
