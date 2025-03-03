import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const Cashflow = () => {
  const [transactionType, setTransactionType] = useState("Book Transaction");
  const [books, setBooks] = useState([{ name: "", cost: "" }]); // No price field
  const [bookSuggestions, setBookSuggestions] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [sellingPrice, setSellingPrice] = useState(""); // Single selling price input
  const [miscTransaction, setMiscTransaction] = useState({ name: "", amount: "", operation: "Add" });
  const [transactions, setTransactions] = useState([]);
  const [totals, setTotals] = useState({ totalCost: 0, totalSelling: 0, profit: 0 });

  useEffect(() => {
    fetchTransactions();
  }, [date]);

  const fetchBookSuggestions = async (query) => {
    if (query.length < 2) {
      setBookSuggestions([]); // Clear suggestions if query is too short
      return;
    }

    try {
      const res = await axios.get(`https://uskillbook.onrender.com/api/books?query=${query}`);

      if (res.data && Array.isArray(res.data)) {
        setBookSuggestions(res.data); // Ensure it's an array before setting
      } else {
        setBookSuggestions([]); // Clear if response is not as expected
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      setBookSuggestions([]); // Clear suggestions on error
    }
  };


  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`https://uskillbook.onrender.com/api/transactions?date=${date}`);
      setTransactions(res.data.transactions);
      setTotals(res.data.totals);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleBookChange = (index, field, value) => {
    const newBooks = [...books];
    newBooks[index][field] = value;
    setBooks(newBooks);

    if (field === "name") {
      fetchBookSuggestions(value);
    }
  };


  const selectBook = (index, book) => {
    const newBooks = [...books];
    newBooks[index] = { name: book.name, cost: book.cost };
    setBooks(newBooks);
    setBookSuggestions([]);
  };

  const addAnotherBook = () => {
    setBooks([...books, { name: "", cost: "" }]);
  };

  const handleMiscChange = (field, value) => {
    setMiscTransaction({ ...miscTransaction, [field]: value });
  };

  const handleSubmit = async () => {
    if (transactionType === "Book Transaction") {
      if (books.length === 0 || sellingPrice === "") {
        alert("Please add at least one book and enter selling price.");
        return;
      }
    } else if (!miscTransaction.name || !miscTransaction.amount) {
      alert("Please enter all details for miscellaneous transaction.");
      return;
    }

    const data = transactionType === "Book Transaction"
      ? { type: "Book", books, sellingPrice, date }
      : { type: "Misc", ...miscTransaction, date };

    try {
      await axios.post("https://uskillbook.onrender.com/api/transactions", data);
      fetchTransactions();
      setBooks([{ name: "", cost: "" }]);
      setSellingPrice("");
      setMiscTransaction({ name: "", amount: "", operation: "Add" });
    } catch (error) {
      console.error("Error submitting transaction:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://uskillbook.onrender.com/api/transactions/${id}`);
      fetchTransactions();
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  return (
    <div className="cashflow-container">
      {/* Transaction Type Selector */}
      <div className="transaction-type">
        <button onClick={() => setTransactionType("Book Transaction")}>
          📚 Book Transaction
        </button>
        <button onClick={() => setTransactionType("Miscellaneous Transaction")}>
          💰 Misc Transaction
        </button>
      </div>

      {/* Book Transaction Form */}
      {transactionType === "Book Transaction" && (
        <motion.div className="book-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {books.map((book, index) => (
            <div key={index} className="book-entry">
              <input
                type="text"
                placeholder="Book Name"
                value={book.name}
                onChange={(e) => handleBookChange(index, "name", e.target.value)}
              />
              {bookSuggestions.length > 0 && (
                <div className="suggestions">
                  {bookSuggestions.map((b, i) => (
                    <div key={i} onClick={() => selectBook(index, b)} className="suggestion-item">
                      {b.name} - ₹{b.cost}
                    </div>
                  ))}
                </div>
              )}

              <input
                type="number"
                placeholder="Cost"
                value={book.cost}
                onChange={(e) => handleBookChange(index, "cost", e.target.value)}
              />
            </div>
          ))}
          <button onClick={addAnotherBook}>➕ Add Another Book</button>

          {/* Selling Price Input */}
          <input
            type="number"
            placeholder="Total Selling Price"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
          />
        </motion.div>
      )}

      {/* Misc Transaction Form */}
      {transactionType === "Miscellaneous Transaction" && (
        <motion.div className="misc-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <input
            type="text"
            placeholder="Transaction Name"
            value={miscTransaction.name}
            onChange={(e) => handleMiscChange("name", e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            value={miscTransaction.amount}
            onChange={(e) => handleMiscChange("amount", e.target.value)}
          />
          <select
            value={miscTransaction.operation}
            onChange={(e) => handleMiscChange("operation", e.target.value)}
          >
            <option value="Add">Add</option>
            <option value="Subtract">Subtract</option>
          </select>
        </motion.div>
      )}

      {/* Date Selector */}
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

      <button onClick={handleSubmit}>✅ Submit Transaction</button>

      {/* Transactions Display */}
      <div className="transactions">
        <h2>📜 Transactions for {date}</h2>
        {transactions.map((txn) => (
          <motion.div key={txn._id} className="transaction-item" initial={{ x: -50 }} animate={{ x: 0 }}>
            {txn.type === "Book" ? (
              <>
                <h3>📖 Books: {txn.books.map((b) => `${b.name} (₹${b.cost})`).join(", ")}</h3>
                <p>💵 Selling Price: ₹{txn.sellingPrice}</p>
                <button onClick={() => handleDelete(txn._id)}>❌ Delete</button>
              </>
            ) : (
              <>
                <h3>💵 {txn.misc.name} - ₹{txn.misc.amount} ({txn.misc.operation})</h3>
                <button onClick={() => handleDelete(txn._id)}>❌ Delete</button>
              </>
            )}
          </motion.div>
        ))}
      </div>

      {/* Profit Calculation */}
      <div className="profit-section">
        <h2>📊 Daily Summary ({date})</h2>
        <p>📉 Total Cost: ₹{totals.totalCost}</p>
        <p>💰 Total Selling: ₹{totals.totalSelling}</p>
        <p>🏆 Profit: ₹{totals.profit}</p>
      </div>
    </div>
  );
};

export default Cashflow;
