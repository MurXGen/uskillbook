import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const API_BASE_URL = "https://uskillbook.onrender.com/api/transactions";

const Cashflow = () => {
  const [itemName, setItemName] = useState("");
  const [cost, setCost] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [date, setDate] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios.get(API_BASE_URL)
      .then(res => setTransactions(res.data))
      .catch(err => console.log("Error fetching transactions:", err));
  }, []);

  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    
    try {
      const res = await axios.get(`${API_BASE_URL}/search?query=${query}`);
      setSuggestions(res.data);
    } catch (err) {
      console.log("Error fetching suggestions:", err);
    }
  };

  const handleItemChange = (e) => {
    const value = e.target.value;
    setItemName(value);
    fetchSuggestions(value);
  };

  const selectSuggestion = (suggestion) => {
    setItemName(suggestion.itemName);
    setCost(suggestion.cost);
    setSuggestions([]);
  };

  const addTransaction = async () => {
    if (!itemName || !cost || !sellingPrice || !date) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const newTransaction = { itemName, cost, sellingPrice, date };
      await axios.post(API_BASE_URL, newTransaction);
      setTransactions([...transactions, newTransaction]);
      
      // Reset fields
      setItemName("");
      setCost("");
      setSellingPrice("");
      setDate("");
    } catch (err) {
      console.log("Error adding transaction:", err);
    }
  };

  return (
    <div className="cashflow">
      <motion.div className="transactionForm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2>Add Transaction</h2>
        <input type="text" value={itemName} onChange={handleItemChange} placeholder="Transaction Item Name" />
        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((s, index) => (
              <li key={index} onClick={() => selectSuggestion(s)}>
                {s.itemName} (₹{s.cost})
              </li>
            ))}
          </ul>
        )}
        <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="Cost" />
        <input type="number" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} placeholder="Selling Price" />
        <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
        <button onClick={addTransaction}>Add Transaction</button>
      </motion.div>

      <div className="transactionHistory">
        <h2>Transaction History</h2>
        {transactions.map((txn, index) => (
          <div key={index} className="transaction-item">
            <p>{txn.itemName} - ₹{txn.cost} (Sold at ₹{txn.sellingPrice})</p>
            <small>{new Date(txn.date).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cashflow;
