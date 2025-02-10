import React, { useState } from "react";
import { motion } from "framer-motion";

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

  const handleSubmit = async () => {
    if (!image) {
      alert("Please upload an image.");
      return;
    }

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

      if (response.ok) {
        window.location.href = "https://razorpay.me/@uskillbook"; // Redirect to payment
      } else {
        alert("Order failed. Try again.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred.");
    }
  };

  return (
    <div className="image-upload-container">
      <h2>Upload Image</h2>
      <div className="upload-box">
        {imageUrl && <img src={imageUrl} alt="Preview" className="preview-img" />}
        {!imageUrl && (
          <label htmlFor="fileInput" className="upload-placeholder">
            <span className="material-symbols-outlined">upload</span>
            Click to upload image
          </label>
        )}
        <input
          type="file"
          accept="image/*"
          id="fileInput"
          onChange={handleImageChange}
          className="file-input"
          capture="environment"
        />
      </div>

      <div className="dropdowns">
        {/* Payment Mode Dropdown */}
        <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
          <option value="Online Mode">Online Mode</option>
          <option value="Cash">Cash</option>
        </select>

        {/* Buy Type Dropdown */}
        <select value={buyType} onChange={(e) => setBuyType(e.target.value)}>
          <option value="Buy">Buy</option>
          <option value="Rent">Rent</option>
        </select>
      </div>

      <button className="submit-button" onClick={handleSubmit}>
        Pay
      </button>
    </div>
  );
};

export default ImageUploadComponent;
