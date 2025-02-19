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

  // Function to compress image
  const compressImage = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxSize = 1024; // Resize to max 1024px width or height
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to JPEG with 80% quality
          canvas.toBlob(
            (blob) => {
              resolve(blob);
            },
            "image/jpeg",
            0.8
          );
        };
      };
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size before compression
    if (file.size > 10 * 1024 * 1024) {
      alert("File is too large. Compressing...");
    }

    const compressedImage = await compressImage(file);

    // Convert blob to File
    const compressedFile = new File([compressedImage], file.name, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(compressedFile);

    setImage(compressedFile);
  };

  const handleUploadClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleSubmit = async () => {
    if (!image) {
      alert("Please upload an image.");
      return;
    }

    setIsLoading(true);

    // Upload image to Cloudinary first
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "your_upload_preset"); // Replace with Cloudinary upload preset

    try {
      const cloudinaryResponse = await fetch(
        "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", // Replace with your Cloudinary URL
        {
          method: "POST",
          body: formData,
        }
      );

      const cloudinaryData = await cloudinaryResponse.json();
      if (!cloudinaryResponse.ok) {
        throw new Error("Cloudinary upload failed");
      }

      const imageUrl = cloudinaryData.secure_url;

      // Now send the order details to your backend
      const orderData = {
        image: imageUrl,
        price,
        paymentMode,
        buyType,
      };

      const response = await fetch("https://uskillbook.onrender.com/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        window.location.href = "https://uskillbook.vercel.app/transaction-history";
      } else {
        alert("Order failed. Try again.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred.");
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
            <button className="dropdown-btn" onClick={() => setShowPaymentDropdown(!showPaymentDropdown)}>
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
            <button className="dropdown-btn" onClick={() => setShowBuyTypeDropdown(!showBuyTypeDropdown)}>
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
                  <li onClick={() => { setBuyType("Buy"); setShowBuyTypeDropdown(false); }}>Buy</li>
                  <li onClick={() => { setBuyType("Rent"); setShowBuyTypeDropdown(false); }}>Rent</li>
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>

        <button className="submit" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Processing..." : "Pay"}
          <span className="material-symbols-outlined">arrow_right_alt</span>
        </button>
      </div>
    </>
  );
};

export default ImageUploadComponent;
