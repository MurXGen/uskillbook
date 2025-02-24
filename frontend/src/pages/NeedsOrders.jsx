import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "../NeedOrders.css";

const NeedOrders = () => {
  const [bookName, setBookName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [requiredDate, setRequiredDate] = useState("");
  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);

  // Fetch queries from backend
  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const res = await axios.get("https://uskillbook.onrender.com/api/queries");
      setQueries(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Submit new query
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bookName || !mobileNumber || !requiredDate) {
      alert("All fields are required");
      return;
    }

    try {
      const res = await axios.post("https://uskillbook.onrender.com/api/queries", {
        bookName,
        mobileNumber,
        requiredDate,
      });
      setQueries([res.data, ...queries]); // Show immediately
      setBookName("");
      setMobileNumber("");
      setRequiredDate("");
    } catch (err) {
      console.error(err);
    }
  };

  // Delete query
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://uskillbook.onrender.com/api/queries/${id}`);
      setQueries(queries.filter((q) => q._id !== id));
      setSelectedQuery(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="need-orders">
      <h2>Request a Book</h2>
      <form onSubmit={handleSubmit} className="query-form">
        <input type="text" placeholder="Book Name" value={bookName} onChange={(e) => setBookName(e.target.value)} required />
        <input type="text" placeholder="Mobile Number" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} required />
        <input type="date" value={requiredDate} onChange={(e) => setRequiredDate(e.target.value)} required />
        <button type="submit">Submit</button>
      </form>

      <div className="queries-list">
        {queries.map((query) => (
          <motion.div
            key={query._id}
            className="query-item"
            whileTap={{ scale: 1.05 }}
            onClick={() => setSelectedQuery(query)}
          >
            <p><b>{query.bookName}</b></p>
            <p>📞 {query.mobileNumber}</p>
            <p>📅 {query.requiredDate}</p>
          </motion.div>
        ))}
      </div>

      {/* Pop-out edit & delete options */}
      <AnimatePresence>
        {selectedQuery && (
          <motion.div
            className="query-options"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
          >
            <button onClick={() => handleDelete(selectedQuery._id)}>Delete</button>
            <button onClick={() => alert("Edit functionality coming soon!")}>Edit</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NeedOrders;
