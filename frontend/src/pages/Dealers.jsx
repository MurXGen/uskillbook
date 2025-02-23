import React, { useState, useEffect } from "react";
import axios from "axios";

const Dealer = () => {
  const [suppliers, setSuppliers] = useState([]); // Ensure it's an array
  const [newSupplier, setNewSupplier] = useState({ name: "", balance: 0 });
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [transactionAmount, setTransactionAmount] = useState(0);

  // Fetch suppliers from the database
  const fetchSuppliers = async () => {
    try {
      const { data } = await axios.get("https://uskiilbook.onrender.com/api/suppliers/all");
      if (Array.isArray(data)) {
        setSuppliers(data);
      } else {
        setSuppliers([]); // Fallback if response is not an array
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      setSuppliers([]); // Fallback on error
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Add a new supplier
  const addSupplier = async () => {
    if (!newSupplier.name) return alert("Please enter a name");
    try {
      await axios.post("https://uskiilbook.onrender.com/api/suppliers/add", newSupplier);
      setNewSupplier({ name: "", balance: 0 });
      fetchSuppliers(); // Refresh list
    } catch (error) {
      console.error("Error adding supplier:", error);
    }
  };

  // Update supplier balance (Add or Subtract)
  const updateBalance = async (type) => {
    if (!selectedSupplier || transactionAmount <= 0) return alert("Enter valid details");

    try {
      await axios.put("https://uskiilbook.onrender.com/api/suppliers/update", {
        supplierId: selectedSupplier,
        amount: type === "add" ? transactionAmount : -transactionAmount,
      });

      setTransactionAmount(0);
      fetchSuppliers(); // Refresh after update
    } catch (error) {
      console.error("Error updating balance:", error);
    }
  };

  // Delete a supplier
  const deleteSupplier = async (id) => {
    try {
      await axios.delete(`https://uskiilbook.onrender.com/api/suppliers/delete/${id}`);
      fetchSuppliers(); // Refresh after deletion
    } catch (error) {
      console.error("Error deleting supplier:", error);
    }
  };

  return (
    <div>
      <h2>Suppliers</h2>

      {/* Add New Supplier */}
      <div>
        <input
          type="text"
          placeholder="Supplier Name"
          value={newSupplier.name}
          onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Initial Balance"
          value={newSupplier.balance}
          onChange={(e) => setNewSupplier({ ...newSupplier, balance: Number(e.target.value) })}
        />
        <button onClick={addSupplier}>Add Supplier</button>
      </div>

      {/* Supplier List */}
      <h3>Supplier List</h3>
      {Array.isArray(suppliers) && suppliers.length > 0 ? (
        suppliers.map((sup) => (
          <div key={sup._id}>
            <span>{sup.name} - ₹{sup.balance}</span>
            <button onClick={() => deleteSupplier(sup._id)}>Delete</button>
          </div>
        ))
      ) : (
        <p>No suppliers available</p>
      )}

      {/* Update Supplier Balance */}
      <h3>Update Supplier Balance</h3>
      <select value={selectedSupplier} onChange={(e) => setSelectedSupplier(e.target.value)}>
        <option value="">Select Supplier</option>
        {suppliers.map((sup) => (
          <option key={sup._id} value={sup._id}>
            {sup.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Amount"
        value={transactionAmount}
        onChange={(e) => setTransactionAmount(Number(e.target.value))}
      />

      <button onClick={() => updateBalance("add")}>+</button>
      <button onClick={() => updateBalance("subtract")}>-</button>
    </div>
  );
};

export default Dealer;
