import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const API_BASE_URL = "https://uskillbook.onrender.com/api/suppliers";

const SupplierList = ({ refresh }) => {
  const [suppliers, setSuppliers] = useState([]);

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
          <p><strong>{supplier.name}</strong> - ₹{supplier.balance}</p>
          <button onClick={() => deleteSupplier(supplier._id)}>Delete</button>

          <div className="transaction-history">
            <h4>Transaction History:</h4>
            {supplier.transactions.length > 0 ? (
              <ul>
                {supplier.transactions.map((txn, i) => (
                  <li key={i}>
                    {txn.type} ₹{txn.amount} for "{txn.reason}" on {new Date(txn.date).toLocaleString()}
                  </li>
                ))}
              </ul>
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
