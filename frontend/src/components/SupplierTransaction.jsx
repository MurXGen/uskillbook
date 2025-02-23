import { useEffect, useState } from "react";
import axios from "axios";

const SupplierTransaction = ({ onTransaction }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/suppliers")
      .then(res => setSuppliers(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleTransaction = (change) => {
    axios.put(`http://localhost:5000/api/suppliers/${selectedSupplier}`, { amount: change })
      .then(() => {
        setAmount("");
        onTransaction();
      })
      .catch(err => console.log(err));
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
      <button onClick={() => handleTransaction(amount)}>+</button>
      <button onClick={() => handleTransaction(-amount)}>-</button>
    </div>
  );
};

export default SupplierTransaction;
