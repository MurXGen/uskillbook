import { useEffect, useState } from "react";
import axios from "axios";

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
    <div>
      {suppliers.length > 0 ? (
        suppliers.map((supplier) => (
          <div key={supplier._id}>
            <p>
              <strong>{supplier.name}</strong> - ₹{supplier.balance}
            </p>
            <button onClick={() => deleteSupplier(supplier._id)}>Delete</button>

            {/* Display Transaction History */}
            <div>
              <h4>Transaction History:</h4>
              {supplier.transactions.length > 0 ? (
                <ul>
                  {supplier.transactions.map((txn, index) => (
                    <li key={index}>
                      {txn.type} ₹{txn.amount} on {new Date(txn.date).toLocaleString()}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No transactions yet.</p>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>No suppliers available.</p>
      )}
    </div>
  );
};

export default SupplierList;
