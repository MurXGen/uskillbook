import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../checkout.css";
import axios from 'axios';
import imageCompression from "browser-image-compression";

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

  useEffect(() => {
    const handleResize = () => {
      setIsKeyboardOpen(window.innerHeight < 500);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Compression Options
    const options = {
      maxSizeMB: 1, // Set the maximum size (1MB)
      maxWidthOrHeight: 1024, // Resize image
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      console.log("Original File Size:", file.size / 1024 / 1024, "MB");
      console.log("Compressed File Size:", compressedFile.size / 1024 / 1024, "MB");

      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(compressedFile);

      setImage(compressedFile);
    } catch (error) {
      console.error("Image Compression Error:", error);
    }
  };


  const handleUploadClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleSubmit = async () => {
    if (!image) {
      alert("Please upload an image.");
      return;
    }
    if (!price) {
      alert("Please enter the price.");
      return;
    }
    if (!paymentMode) {
      alert("Please select a payment mode.");
      return;
    }
    if (!buyType) {
      alert("Please select a buy type.");
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

      if (!response.ok) {
        throw new Error("Order submission failed");
      }

      const data = await response.json();
      console.log("Order Success:", data);

      window.location.href = "https://uskillbook.vercel.app/checkout";
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
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
              {paymentMode || "Select Payment Mode"}
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
              {buyType || "Select Buy Type"}
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
