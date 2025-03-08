const React = require("react");
const { useState } = require("react");
const axios = require("axios");
require("./cashflow.css"); // Ensure styles are included

const Cashflow = () => {
  const [items, setItems] = useState([{ name: "", cost: "" }]);
  const [sellingPrice, setSellingPrice] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Handle change in input fields
  const handleChange = async (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);

    // Fetch book name suggestions
    if (field === "name" && value.length > 1) {
      try {
        const res = await axios.get(
          `https://uskillbook.onrender.com/api/books/search?query=${value}`
        );
        setSuggestions(res.data);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      }
    }
  };

  // Add another book input field
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
      await axios.post("https://uskillbook.onrender.com/api/cashflow", orderData);
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

module.exports = Cashflow;