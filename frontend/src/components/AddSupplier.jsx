import { useState } from "react";
import axios from "axios";
import '../Supplier.css'

const API_BASE_URL = "https://uskillbook.onrender.com/api/suppliers"; // Updated API base URL

const AddSupplier = ({ onAdd }) => {
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");

  const handleAdd = () => {
    if (!name.trim() || balance === "") {
      alert("Please enter a valid supplier name and balance.");
      return;
    }

    axios
      .post(API_BASE_URL, { name, balance: Number(balance) })
      .then(() => {
        setName("");
        setBalance("");
        onAdd();
      })
      .catch((err) => console.log("Error adding supplier:", err));
  };

  return (
    <div className="addSupplier">
      <input
        type="text"
        placeholder="Supplier Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Balance"
        value={balance}
        onChange={(e) => setBalance(e.target.value)}
      />
      <button onClick={handleAdd}>Add Supplier</button>
    </div>
  );
};

export default AddSupplier;
