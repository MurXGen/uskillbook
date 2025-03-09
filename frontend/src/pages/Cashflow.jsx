import React, { useState } from "react";
import axios from "axios";
import "./cashflow.css"; // Ensure styles are included

const Cashflow = () => {
  const [items, setItems] = useState([{ name: "", cost: "" }]);
  const [sellingPrice, setSellingPrice] = useState("");
  const [suggestions, setSuggestions] = useState([]); // Suggestions for the active input
  const [activeIndex, setActiveIndex] = useState(null); // Track which input is active

  // Handle change in input fields
  const handleChange = async (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);

    if (field === "name") {
      setActiveIndex(index); // Set active input index
      if (value.length > 1) {
        try {
          const res = await axios.get(
            `https://uskillbook.onrender.com/api/books/search?query=${value}`
          );
          setSuggestions(res.data); // Only store suggestions for the active input
        } catch (err) {
          console.error("Error fetching suggestions:", err);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]); // Clear suggestions if input is empty
      }
    }
  };

  // Add another book input field
  const addItem = () => {
    setItems([...items, { name: "", cost: "" }]);
    setSuggestions([]); // Clear suggestions when adding a new item
    setActiveIndex(null);
  };

  // Handle selecting a suggestion
  const handleSuggestionClick = (name) => {
    const newItems = [...items];
    newItems[activeIndex].name = name;
    setItems(newItems);
    setActiveIndex(null); // Close suggestions for this input
    setSuggestions([]); // Clear suggestions
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderData = { items, sellingPrice };

    try {
      await axios.post("https://uskillbook.onrender.com/api/cashflow", orderData);
      alert("Transaction Added Successfully");
      setItems([{ name: "", cost: "" }]);
      setSellingPrice("");
      setSuggestions([]); // Clear suggestions after submitting
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
              placeholder="Item Name"
              value={item.name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
              onFocus={() => setActiveIndex(index)} // Only show suggestions for this input
              onBlur={() => setTimeout(() => setActiveIndex(null), 200)} // Hide suggestions when clicking away
            />
            {activeIndex === index && suggestions.length > 0 && (
              <ul className="suggestions-list">
                {suggestions.map((book, i) => (
                  <li key={i} onClick={() => handleSuggestionClick(book.name)}>
                    {book.name}
                  </li>
                ))}
              </ul>
            )}

            <input
              type="number"
              placeholder="Cost"
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
          placeholder="Selling Price"
          value={sellingPrice}
          onChange={(e) => setSellingPrice(e.target.value)}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Cashflow;
