import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import '../Cashflow.css';

const API_BASE_URL = "https://uskillbook.onrender.com/api/transactions";

const Cashflow = () => {
  const [itemName, setItemName] = useState("");
  const [cost, setCost] = useState("");
  const [date, setDate] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [basket, setBasket] = useState([]); // Stores items before submitting
  const [sellingPrice, setSellingPrice] = useState("");
  const [loading, setLoading] = useState(false);

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

  const addItemToBasket = () => {
    if (!itemName || !cost) {
      alert("Please enter item name and cost.");
      return;
    }

    setBasket([...basket, { itemName, cost }]);
    setItemName("");
    setCost("");
  };

  const submitTransaction = async () => {
    if (basket.length === 0 || !sellingPrice) {
      alert("Please add items and enter selling price.");
      return;
    }

    setLoading(true);

    try {
      const newTransaction = {
        items: basket,
        sellingPrice,
        date: date || new Date().toISOString(), // Use entered date or today's date
      };

      await axios.post(API_BASE_URL, newTransaction);

      setTransactions([...transactions, newTransaction]);
      setBasket([]);
      setSellingPrice("");
      setDate("");
    } catch (err) {
      console.log("Error submitting transaction:", err);
    } finally {
      setLoading(false);
    }
  };

  const groupTransactionsByDate = () => {
    if (!transactions || transactions.length === 0) return {}; // ✅ Prevents error

    const grouped = {};
    transactions.forEach((txn) => {
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
        <h2>Add Items to Sale</h2>
        <input type="text" value={itemName} onChange={handleItemChange} placeholder="Item Name" />
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
        <button onClick={addItemToBasket}>Add Item</button>

        {basket.length > 0 && (
          <>
            <h3>Items in Basket:</h3>
            <ul>
              {basket.map((item, index) => (
                <li key={index}>{item.itemName} - ₹{item.cost}</li>
              ))}
            </ul>
          </>
        )}

        <input type="number" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} placeholder="Total Selling Price" />
        <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />

        <button onClick={submitTransaction} disabled={loading}>
          {loading ? "Saving..." : "Submit Sale"}
        </button>
      </motion.div>

      <div className="transactionHistory">
        <h2>Transaction History</h2>
        {Object.keys(groupedTransactions || {}).map((date, index) => (
          <div key={index} className="transaction-box">
            <h3>{date}</h3>
            {(groupedTransactions[date] || []).map((txn, idx) => (
              <div key={idx} className="transaction-item">
                {(txn.items || []).map((item, i) => (  // ✅ Prevents undefined error
                  <p key={i}>{item.itemName} - ₹{item.cost}</p>
                ))}
                <strong>Total Selling Price: ₹{txn.sellingPrice}</strong>
              </div>
            ))}
          </div>
        ))}

      </div>
    </div>
  );
};

export default Cashflow;
