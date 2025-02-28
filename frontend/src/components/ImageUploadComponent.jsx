import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../checkout.css";
import axios from 'axios';

const ImageUploadComponent = ({
  image,
  setImage,
  price,
  paymentMode,
  setPaymentMode,
  buyType,
  setBuyType,
}) => {
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);
  const [showBuyTypeDropdown, setShowBuyTypeDropdown] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setImage(file);
    }
  };

  const handleUploadClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleSubmit = async () => {
    if (!image) {
      alert("❌ Please upload an image.");
      return;
    }
  
    setIsLoading(true);
  
    try {
      // Convert image to Base64
      const base64Image = await convertToBase64(image);
  
      const orderData = {
        image: base64Image, // Send as Base64
        price,
        paymentMode,
        buyType,
      };
  
      console.log("📦 Sending Order Data:", orderData);
  
      const response = await fetch("https://uskillbook.onrender.com/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
  
      const data = await response.json();
      console.log("📦 Response Data:", data);
  
      if (response.ok) {
        window.location.href = "https://uskillbook.vercel.app/checkout";
      } else {
        alert("❌ Order failed. Try again.");
      }
    } catch (error) {
      console.error("❌ Error submitting order:", error);
      alert("❌ An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Convert image to Base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  

  return (
    <>
      <div className="securedNote">
        <span className="material-symbols-outlined">verified</span>
        <span>Final Step</span>
      </div>

      <div className="image-upload-container">
        {isLoading && (
          <div className="loading-overlay">
            <motion.div
              className="loading-icon"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              🔄
            </motion.div>
            <p>Processing your order...</p>
          </div>
        )}

        <div className="upload-box" onClick={handleUploadClick}>
          {imageUrl ? (
            <img src={imageUrl} alt="Preview" className="preview-img" />
          ) : (
            <div className="upload-placeholder">
              <span className="material-symbols-outlined">upload</span>
              <p>Click to upload image</p>
            </div>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          id="fileInput"
          onChange={handleImageChange}
          className="file-input"
          capture="environment"
          style={{ display: "none" }}
        />

        {/* Animated Dropdowns */}
        <div className="dropdowns">
          {/* Payment Mode Dropdown */}
          <div className="dropdown">
            <button
              className="dropdown-btn"
              onClick={() => setShowPaymentDropdown(!showPaymentDropdown)}
            >
              {paymentMode}
              <span className="material-symbols-outlined">
                keyboard_arrow_down
              </span>
            </button>
            <AnimatePresence>
              {showPaymentDropdown && (
                <motion.ul
                  className="dropdown-list"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <li onClick={() => { setPaymentMode("Online Mode"); setShowPaymentDropdown(false); }}>
                    Online Mode
                  </li>
                  <li onClick={() => { setPaymentMode("Cash"); setShowPaymentDropdown(false); }}>
                    Cash
                  </li>
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* Buy Type Dropdown */}
          <div className="dropdown">
            <button
              className="dropdown-btn"
              onClick={() => setShowBuyTypeDropdown(!showBuyTypeDropdown)}
            >
              {buyType}
              <span className="material-symbols-outlined">
                keyboard_arrow_down
              </span>
            </button>
            <AnimatePresence>
              {showBuyTypeDropdown && (
                <motion.ul
                  className="dropdown-list"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <li onClick={() => { setBuyType("Buy"); setShowBuyTypeDropdown(false); }}>
                    Buy
                  </li>
                  <li onClick={() => { setBuyType("Rent"); setShowBuyTypeDropdown(false); }}>
                    Rent
                  </li>
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>

        <button
          className={`submit fixed-proceed ${isKeyboardOpen ? "slide-up" : ""}`}
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Proceed"}
          <span className="material-symbols-outlined">
            arrow_right_alt
          </span>
        </button>
      </div>
    </>
  );
};

export default ImageUploadComponent;
