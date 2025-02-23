import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://uskillbook.onrender.com/api/suppliers";

const SupplierTransaction = ({ onTransaction }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    axios.get(API_BASE_URL)
      .then(res => setSuppliers(res.data))
      .catch(err => console.log("Error fetching suppliers:", err));
  }, []);

  const handleTransaction = (change) => {
    axios.put(`${API_BASE_URL}/${selectedSupplier}`, { amount: change })
      .then(() => {
        setAmount("");
        onTransaction();
      })
      .catch(err => console.log("Error updating balance:", err));
  };

  return (
    <div>
      <select onChange={(e) => setSelectedSupplier(e.target.value)}>
        <option>Select Supplier</option>
        {suppliers.map((supplier) => (
          <option key={supplier._id} value={supplier._id}>{supplier.name}</option>
        ))}
      </select>
      <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} />
      <button onClick={() => handleTransaction(Number(amount))}>+</button>
      <button onClick={() => handleTransaction(-Number(amount))}>-</button>
    </div>
  );
};

export default SupplierTransaction;
