import React, { useState, useEffect } from "react";
import "../checkout.css";

const PriceComponent = ({ price, setPrice, onNext }) => {
  const [message, setMessage] = useState(""); // State for the dynamic message
  const [isAnimating, setIsAnimating] = useState(false); // State for animation trigger

  // Function to determine message based on price
  useEffect(() => {
    let newMessage = "";
    if (price >= 1000) {
      newMessage = "🚀 You are our Hero!";
    }
    else if (price >= 800) {
      newMessage = "📚You're our GOLDEN Reader..!";
    }
    else if (price >= 500) {
      newMessage = "📚 You've got more, enjoy reading..!";
    } else if (price >= 300) {
      newMessage = "🎉 You've become our legit customer!";
    } else if (price >= 100) {
      newMessage = "🔥 You've got the best book at a lower price!";
    } else {
      newMessage = "Enter amount to be paid";
    }

    // If message changes, trigger animation
    if (newMessage !== message) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500); // Animation duration
    }

    setMessage(newMessage);
  }, [price]); // Runs whenever `price` changes

  return (
    <div className="pricContainer">
      <div className="securedNote">
        <span className="material-symbols-outlined">verified</span>
        <span>Secured Payment</span>
      </div>

      <div className="priceAccept">
        <div className="priceIntake">
          <span className="material-symbols-outlined">currency_rupee</span>
          <input
            type="number"
            placeholder="00"
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
        </div>

        {/* Animated Amount Notes */}
        <div className={`amountNotes ${isAnimating ? "pop-animation" : ""}`}>
          <span>{message}</span>
        </div>
      </div>

      <button className="fixed-proceed-btn" onClick={onNext} disabled={!price}>
        Next
        <span className="material-symbols-outlined">arrow_right_alt</span>
      </button>
    </div>
  );
};

export default PriceComponent;
