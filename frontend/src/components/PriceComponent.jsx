import React, { useState, useEffect } from "react";

const PriceComponent = ({ price, setPrice, onNext }) => {
  const [message, setMessage] = useState(""); 
  const [isAnimating, setIsAnimating] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsKeyboardOpen(window.innerHeight < 500);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let newMessage = "";
    if (price >= 1000) newMessage = "🚀 You are our Hero!";
    else if (price >= 800) newMessage = "📚You're our GOLDEN Reader..!";
    else if (price >= 500) newMessage = "📚 You've got more, enjoy reading..!";
    else if (price >= 300) newMessage = "🎉 You've become our legit customer!";
    else if (price >= 100) newMessage = "🔥 You've got the best book at a lower price!";
    else newMessage = "Enter amount to be paid";

    if (newMessage !== message) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    }

    setMessage(newMessage);
  }, [price]);

  return (
    <div className="priceContainer">
      <div className={`button-container ${isKeyboardOpen ? "button-above-keyboard" : ""}`}>
        <button className="next-button" onClick={onNext} disabled={!price}>
          Next
          <span className="material-symbols-outlined">arrow_right_alt</span>
        </button>
      </div>
    </div>
  );
};


export default PriceComponent;
