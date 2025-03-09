import React, { useState } from "react";
import axios from "axios";
import "./cashflow.css";

const Cashflow = () => {
  const [items, setItems] = useState([{ name: "", cost: "", suggestions: [] }]);
  const [sellingPrice, setSellingPrice] = useState("");
  const [activeIndex, setActiveIndex] = useState(null); // Tracks which input is active

  // Handle input change
  const handleChange = async (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);

    if (field === "name") {
      setActiveIndex(index); // Show suggestions only for this input
      if (value.length > 1) {
        try {
          const res = await axios.get(
            `https://uskillbook.onrender.com/api/books/search?query=${value}`
          );
          newItems[index].suggestions = res.data; // Store suggestions for this input only
        } catch (err) {
          console.error("Error fetching suggestions:", err);
          newItems[index].suggestions = [];
        }
      } else {
        newItems[index].suggestions = []; // Clear suggestions if input is too short
      }
      setItems(newItems);
    }
  };

  // Handle selecting a suggestion
  const handleSuggestionClick = (index, name) => {
    const newItems = [...items];
    newItems[index].name = name;
    newItems[index].suggestions = []; // Clear suggestions for this input
    setItems(newItems);
    setActiveIndex(null);
  };

  // Add new item field
  const addItem = () => {
    setItems([...items, { name: "", cost: "", suggestions: [] }]);
    setActiveIndex(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderData = { items, sellingPrice };

    try {
      await axios.post("https://uskillbook.onrender.com/api/cashflow", orderData);
      alert("Transaction Added Successfully");
      setItems([{ name: "", cost: "", suggestions: [] }]);
      setSellingPrice("");
      setActiveIndex(null);
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  return (
    <div className="cashflow-container">
      <h2>Cashflow Entry</h2>
      <form onSubmit={handleSubmit}>
        {items.map((item, index) => (
          <div key={index} className="item-row">
            <input
              type="text"
              placeholder="Enter item name"
              value={item.name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
              onFocus={() => setActiveIndex(index)} // Set active index when focused
              onBlur={() => setTimeout(() => setActiveIndex(null), 200)} // Delay for clicking
            />
            {activeIndex === index && item.suggestions.length > 0 && (
              <ul className="suggestions-list">
                {item.suggestions.map((book, i) => (
                  <li key={i} onMouseDown={() => handleSuggestionClick(index, book.name)}>
                    {book.name} - ₹{book.price}
                  </li>
                ))}
              </ul>
            )}

            <input
              type="number"
              placeholder="Enter cost"
              value={item.cost}
              onChange={(e) => handleChange(index, "cost", e.target.value)}
            />
          </div>
        ))}

        <button type="button" onClick={addItem}>
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
