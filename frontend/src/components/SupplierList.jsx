import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://uskillbook.onrender.com/api/suppliers"; // Updated API base URL

const SupplierList = ({ refresh }) => {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    axios
      .get(API_BASE_URL)
      .then((res) => setSuppliers(res.data))
      .catch((err) => console.log("Error fetching suppliers:", err));
  }, [refresh]);

  const deleteSupplier = (id) => {
    axios
      .delete(`${API_BASE_URL}/${id}`)
      .then(() => {
        setSuppliers((prevSuppliers) =>
          prevSuppliers.filter((s) => s._id !== id)
        );
      })
      .catch((err) => console.log("Error deleting supplier:", err));
  };

  return (
    <div>
      {suppliers.length > 0 ? (
        suppliers.map((supplier) => (
          <div key={supplier._id}>
            <p>
              {supplier.name} - ₹{supplier.balance}
            </p>
            <button onClick={() => deleteSupplier(supplier._id)}>Delete</button>
          </div>
        ))
      ) : (
        <p>No suppliers available.</p>
      )}
    </div>
  );
};

export default SupplierList;
