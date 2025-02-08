import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Hint from '../assets/hint1.png';
import Hint1 from '../assets/hint2.png';
import '../index.css';

const Checkout = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [price, setPrice] = useState("");
  const [paymentMode, setPaymentMode] = useState("Online Mode");
  const [buyType, setBuyType] = useState("Buy");

  // State to control custom dropdown visibility
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);
  const [showBuyTypeDropdown, setShowBuyTypeDropdown] = useState(false);

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
    if (!image || !price || !paymentMode || !buyType) {
      alert("Please upload an image, enter a price, and select all options.");
      return;
    }
  
    const formData = new FormData();
    formData.append("image", image);
    formData.append("price", price);
    formData.append("paymentMode", paymentMode);
    formData.append("buyType", buyType);
  
    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
  
      if (response.ok) {
        navigate("/summary", {
          state: {
            imageUrl: `http://localhost:5000${data.order.imageUrl}`,
            price,
            paymentMode,
            buyType,
          },
        });
      } else {
        console.error("Server Error Response:", data);
        alert(data.error || "Failed to create order");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("An error occurred. Please try again.");
    }
  };
  

  return (
    <div className="container">
      <div className="note">
        <span className="material-symbols-outlined">verified</span>
        <span className="title">Take Photo & Pay</span>
      </div>

      {!imageUrl && (
        <div className="hint">
          <div className="more">
            <img src={Hint1} alt="" />
            <span className="desc">More than one book? <br />Hold like this</span>
          </div>
          <div className="one">
            <img src={Hint} alt="" />
            <span className="desc">Just one book? <br />Hold like this</span>
          </div>
        </div>
      )}

      {/* Image Upload Section */}
      <div className="userAction">
        <div className="previewContainer">
          {imageUrl && <img src={imageUrl} alt="Preview" className="previewImg" />}
          {!imageUrl && (
            <label htmlFor="fileInput" className="uploadPlaceholder">
              Click to upload image
            </label>
          )}
          <input
            type="file"
            accept="image/*"
            id="fileInput"
            onChange={handleImageChange}
            className="fileInput"
          />
        </div>

        <div className="formFilling">

          <div className="priceBox">
            <span className="material-symbols-outlined">currency_rupee</span>
            <input
              type="number"
              placeholder="Enter Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="priceInput no-border"
            />
          </div>

          {/* Custom Dropdown - Payment Mode */}
          <div className="customDropdown">
            <div
              className="dropdownHeader"
              onClick={() => setShowPaymentDropdown(!showPaymentDropdown)}
            >
              <div className="dropDownLabel">
                <div>{paymentMode}</div>
                <div><span className="material-symbols-outlined">
                  arrow_drop_down_circle
                </span></div>
              </div>

            </div>
            {showPaymentDropdown && (
              <div className="dropdownOptions slide-down">
                <div onClick={() => { setPaymentMode("Online Mode"); setShowPaymentDropdown(false); }}>Online Mode</div>
                <div onClick={() => { setPaymentMode("Cash"); setShowPaymentDropdown(false); }}>Cash</div>
              </div>
            )}
          </div>

          {/* Custom Dropdown - Buy Type */}
          <div className="customDropdown">
            <div
              className="dropdownHeader"
              onClick={() => setShowBuyTypeDropdown(!showBuyTypeDropdown)}
            >
              <div className="dropDownLabel">
                <div>{buyType}</div>
                <div><span className="material-symbols-outlined">
                  arrow_drop_down_circle
                </span></div>
              </div>
            </div>
            {showBuyTypeDropdown && (
              <div className="dropdownOptions slide-down">
                <div onClick={() => { setBuyType("Buy"); setShowBuyTypeDropdown(false); }}>Buy</div>
                <div onClick={() => { setBuyType("Rent"); setShowBuyTypeDropdown(false); }}>Rent</div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Proceed Button */}
      <div className="proceed">
        <button onClick={handleSubmit} className="submit-button">
          Proceed to Summary
          <span className="material-symbols-outlined">arrow_right</span>
        </button>
      </div>
    </div>
  );
};

export default Checkout;
