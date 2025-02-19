import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../checkout.css";

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

  // Handle Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImageUrl(reader.result);
      reader.readAsDataURL(file);
      setImage(file);
    }
  };

  // Open File Input on Click
  const handleUploadClick = () => document.getElementById("fileInput").click();

  // Handle Submit Order
  const handleSubmit = async () => {
    if (!image || !price) {
      alert("⚠️ Please upload an image and enter a valid price.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("price", price);
    formData.append("paymentMode", paymentMode);
    formData.append("buyType", buyType);

    try {
      const response = await fetch("https://uskillbook.onrender.com/api/orders", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Response:", data);

      if (response.ok) {
        window.location.href = "https://uskillbook.vercel.app/transaction-history";
      } else {
        alert("❌ Order failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("⚠️ An error occurred while processing your order.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Secure Note */}
      <div className="securedNote">
        <span className="material-symbols-outlined">verified</span>
        <span>Final Step</span>
      </div>

      <div className="image-upload-container">
        {/* Loading Overlay */}
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

        {/* Upload Box */}
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

        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          id="fileInput"
          onChange={handleImageChange}
          className="file-input"
          capture="environment"
          style={{ display: "none" }}
        />

        {/* Dropdowns */}
        <div className="dropdowns">
          {/* Payment Mode Dropdown */}
          <div className="dropdown">
            <button
              className="dropdown-btn"
              onClick={() => setShowPaymentDropdown(!showPaymentDropdown)}
            >
              {paymentMode}
              <span className="material-symbols-outlined">keyboard_arrow_down</span>
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
              <span className="material-symbols-outlined">keyboard_arrow_down</span>
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

        {/* Submit Button */}
        <button className="submit" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Processing..." : "Pay"}
          <span className="material-symbols-outlined">arrow_right_alt</span>
        </button>
      </div>
    </>
  );
};

export default ImageUploadComponent;
