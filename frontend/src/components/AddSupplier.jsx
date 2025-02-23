import { useState } from "react";
import axios from "axios";

const AddSupplier = ({ onAdd }) => {
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");

  const handleAdd = () => {
    axios.post("http://localhost:5000/api/suppliers", { name, balance: Number(balance) })
      .then(() => {
        setName("");
        setBalance("");
        onAdd();
      })
      .catch(err => console.log(err));
  };

  return (
    <div>
      <input type="text" placeholder="Supplier Name" value={name} onChange={e => setName(e.target.value)} />
      <input type="number" placeholder="Balance" value={balance} onChange={e => setBalance(e.target.value)} />
      <button onClick={handleAdd}>Add Supplier</button>
    </div>
  );
};

export default AddSupplier;
