import { useEffect, useState } from "react";
import axios from "axios";

const SupplierList = ({ refresh }) => {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/suppliers")
      .then(res => setSuppliers(res.data))
      .catch(err => console.log(err));
  }, [refresh]);

  const deleteSupplier = (id) => {
    axios.delete(`http://localhost:5000/api/suppliers/${id}`)
      .then(() => {
        setSuppliers(suppliers.filter(s => s._id !== id));
      })
      .catch(err => console.log(err));
  };

  return (
    <div>
      {suppliers.map((supplier) => (
        <div key={supplier._id}>
          <p>{supplier.name} - ₹{supplier.balance}</p>
          <button onClick={() => deleteSupplier(supplier._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default SupplierList;
