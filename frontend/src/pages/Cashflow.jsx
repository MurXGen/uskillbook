import React, { useState, useEffect } from "react";
import axios from "axios";
import "./cashflow.css"; // Add your styles

const Cashflow = () => {
  const [items, setItems] = useState([{ name: "", cost: "" }]);
  const [sellingPrice, setSellingPrice] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Handle change for input fields
  const handleChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);

    // Fetch suggestions for book names
    if (field === "name" && value.length > 1) {
      axios
        .get(`http://localhost:5000/api/books/search?query=${value}`)
        .then((res) => setSuggestions(res.data))
        .catch((err) => console.error(err));
    }
  };

  // Add another book input
  const addItem = () => {
    setItems([...items, { name: "", cost: "" }]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderData = {
      items,
      sellingPrice,
    };

    try {
      const res = await axios.post("http://localhost:5000/api/cashflow", orderData);
      alert("Transaction Added Successfully");
      setItems([{ name: "", cost: "" }]);
      setSellingPrice("");
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
              list={`suggestions-${index}`}
            />
            <datalist id={`suggestions-${index}`}>
              {suggestions.map((book, i) => (
                <option key={i} value={book.name} />
              ))}
            </datalist>

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
