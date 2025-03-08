import React, { useState, useEffect } from "react";
import axios from "axios";

const Cashflow = () => {
  const [items, setItems] = useState([{ name: "", cost: "" }]);
  const [sellingPrice, setSellingPrice] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    generateOrderId(); // Generate order ID on component mount
  }, []);

  const generateOrderId = () => {
    const id = "ORD-" + Math.floor(100000 + Math.random() * 900000);
    setOrderId(id);
  };

  const handleItemChange = async (index, value) => {
    let updatedItems = [...items];
    updatedItems[index].name = value;
    setItems(updatedItems);

    if (value.length > 1) {
      try {
        const res = await axios.get(
          `https://uskillbook.onrender.com/api/books/search?query=${value}`
        );
        setSuggestions(res.data);
      } catch (error) {
        console.error("Error fetching book suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = async (index, book) => {
    let updatedItems = [...items];
    updatedItems[index] = { name: book.name, cost: book.cost };
    setItems(updatedItems);
    setSuggestions([]);
  };

  const handleAddItem = () => {
    setItems([...items, { name: "", cost: "" }]);
  };

  const handleCostChange = (index, value) => {
    let updatedItems = [...items];
    updatedItems[index].cost = value;
    setItems(updatedItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderData = {
      orderId,
      date: new Date().toISOString(),
      items,
      sellingPrice,
    };

    try {
      await axios.post("https://uskillbook.onrender.com/api/cashflow", orderData);
      alert("Order submitted successfully!");
      setItems([{ name: "", cost: "" }]);
      setSellingPrice("");
      generateOrderId();
    } catch (error) {
      console.error("Error submitting order:", error);
    }
  };

  return (
    <div className="cashflow-container">
      <h2>Cashflow Entry</h2>
      <form onSubmit={handleSubmit}>
        <p>Order ID: {orderId}</p>

        {items.map((item, index) => (
          <div key={index} className="item-row">
            <input
              type="text"
              placeholder="Enter item name"
              value={item.name}
              onChange={(e) => handleItemChange(index, e.target.value)}
            />
            {suggestions.length > 0 && (
              <ul className="suggestions-list">
                {suggestions.map((book) => (
                  <li key={book._id} onClick={() => selectSuggestion(index, book)}>
                    {book.name} - ₹{book.cost}
                  </li>
                ))}
              </ul>
            )}
            <input
              type="number"
              placeholder="Enter cost"
              value={item.cost}
              onChange={(e) => handleCostChange(index, e.target.value)}
            />
          </div>
        ))}

        <button type="button" onClick={handleAddItem}>
          Add Another Item
        </button>

        <input
          type="number"
          placeholder="Enter selling price"
          value={sellingPrice}
          onChange={(e) => setSellingPrice(e.target.value)}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Cashflow;
