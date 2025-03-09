import React, { useState } from "react";
import axios from "axios";
import "./cashflow.css";

const Cashflow = () => {
  const [items, setItems] = useState([{ name: "", cost: "", suggestions: [] }]);
  const [sellingPrice, setSellingPrice] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);

  // Handle change in input fields
  const handleChange = async (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);

    if (field === "name") {
      setActiveIndex(index);
      if (value.length > 1) {
        try {
          const res = await axios.get(
            `https://uskillbook.onrender.com/api/books/search?query=${value}`
          );
          newItems[index].suggestions = res.data; // Store suggestions for this input only
          setItems(newItems);
        } catch (err) {
          console.error("Error fetching suggestions:", err);
          newItems[index].suggestions = [];
          setItems(newItems);
        }
      } else {
        newItems[index].suggestions = [];
        setItems(newItems);
      }
    }
  };

  // Handle selecting a suggestion
  const handleSuggestionClick = (index, name) => {
    const newItems = [...items];
    newItems[index].name = name;
    newItems[index].suggestions = []; // Clear suggestions
    setItems(newItems);
    setActiveIndex(null);
  };

  // Add another book input field
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
              placeholder="Item Name"
              value={item.name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
              onFocus={() => setActiveIndex(index)}
              onBlur={() => setTimeout(() => setActiveIndex(null), 200)}
            />
            {activeIndex === index && item.suggestions.length > 0 && (
              <ul className="suggestions-list">
                {item.suggestions.map((book, i) => (
                  <li key={i} onClick={() => handleSuggestionClick(index, book.name)}>
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
