import React from "react";

const PriceComponent = ({ price, setPrice, onNext }) => {
  return (
    <div className="price-container">
      <h2>Enter Price</h2>
      <input
        type="number"
        placeholder="Enter Price"
        value={price}
        onChange={(e) => {
          const value = e.target.value;
          setPrice(value === "" ? "" : Math.max(1, Number(value)));
        }}
        onBlur={() => {
          if (price === "" || price < 1) setPrice(1);
        }}
        className="price-input"
      />
      <button className="next-button" onClick={onNext} disabled={!price}>
        Next
      </button>
    </div>
  );
};

export default PriceComponent;
