import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import '../Cashflow.css';

const API_BASE_URL = "https://uskillbook.onrender.com/api/transactions";

const Cashflow = () => {
  const [transactions, setTransactions] = useState([]);
  const [newTransactions, setNewTransactions] = useState([{ itemName: "", cost: "", sellingPrice: "" }]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(API_BASE_URL)
      .then(res => setTransactions(res.data))
      .catch(err => console.log("Error fetching transactions:", err));
  }, []);

  const fetchSuggestions = async (query, index) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    
    try {
      const res = await axios.get(`${API_BASE_URL}/search?query=${query}`);
      setSuggestions({ index, data: res.data });
    } catch (err) {
      console.log("Error fetching suggestions:", err);
    }
  };

  const handleItemChange = (e, index) => {
    const value = e.target.value;
    const updatedTransactions = [...newTransactions];
    updatedTransactions[index].itemName = value;
    setNewTransactions(updatedTransactions);
    fetchSuggestions(value, index);
  };

  const selectSuggestion = (suggestion, index) => {
    const updatedTransactions = [...newTransactions];
    updatedTransactions[index].itemName = suggestion.itemName;
    updatedTransactions[index].cost = suggestion.cost;
    setNewTransactions(updatedTransactions);
    setSuggestions([]);
  };

  const addNewTransactionField = () => {
    setNewTransactions([...newTransactions, { itemName: "", cost: "", sellingPrice: "" }]);
  };

  const handleTransactionChange = (e, index, field) => {
    const updatedTransactions = [...newTransactions];
    updatedTransactions[index][field] = e.target.value;
    setNewTransactions(updatedTransactions);
  };

  const addTransactions = async () => {
    if (newTransactions.some(txn => !txn.itemName || !txn.sellingPrice)) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);
    const transactionsToSave = newTransactions.map(txn => ({
      ...txn,
      date: new Date().toISOString()
    }));

    try {
      await axios.post(API_BASE_URL, { transactions: transactionsToSave });
      setTransactions([...transactions, ...transactionsToSave]);
      setNewTransactions([{ itemName: "", cost: "", sellingPrice: "" }]); // Reset fields
    } catch (err) {
      console.log("Error adding transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  const groupTransactionsByDate = () => {
    const grouped = {};
    transactions.forEach(txn => {
      const txnDate = new Date(txn.date).toLocaleDateString();
      if (!grouped[txnDate]) {
        grouped[txnDate] = [];
      }
      grouped[txnDate].push(txn);
    });
    return grouped;
  };

  const groupedTransactions = groupTransactionsByDate();

  return (
    <div className="cashflow">
      <motion.div className="transactionForm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2>Add Transactions</h2>
        {newTransactions.map((txn, index) => (
          <div key={index} className="transaction-inputs">
            <input type="text" value={txn.itemName} onChange={(e) => handleItemChange(e, index)} placeholder="Item Name" />
            {suggestions.index === index && suggestions.data?.length > 0 && (
              <ul className="suggestions">
                {suggestions.data.map((s, i) => (
                  <li key={i} onClick={() => selectSuggestion(s, index)}>
                    {s.itemName} (₹{s.cost})
                  </li>
                ))}
              </ul>
            )}
            <input type="number" value={txn.cost} onChange={(e) => handleTransactionChange(e, index, "cost")} placeholder="Cost" disabled />
            <input type="number" value={txn.sellingPrice} onChange={(e) => handleTransactionChange(e, index, "sellingPrice")} placeholder="Selling Price" />
          </div>
        ))}
        
        <button onClick={addNewTransactionField}>+ Add More Items</button>
        <button onClick={addTransactions} disabled={loading}>
          {loading ? "Saving..." : "Add Transaction"}
        </button>
      </motion.div>

      <div className="transactionHistory">
        <h2>Transaction History</h2>
        {Object.keys(groupedTransactions).map(date => (
          <div key={date} className="transaction-box">
            <h3>{date}</h3>
            {groupedTransactions[date].map((txn, index) => (
              <p key={index}>{txn.itemName} - ₹{txn.cost} (Sold at ₹{txn.sellingPrice})</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cashflow;
