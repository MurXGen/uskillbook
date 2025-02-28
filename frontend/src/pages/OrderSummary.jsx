import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [imageUrl, setImageUrl] = useState("");
  const [price, setPrice] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [buyType, setBuyType] = useState("");

  useEffect(() => {
    if (location.state) {
      setImageUrl(location.state.imageUrl);
      setPrice(location.state.price);
      setPaymentMode(location.state.paymentMode);
      setBuyType(location.state.buyType);
    } else {
      alert("No order details found! Redirecting...");
      navigate("/");
    }
  }, [location, navigate]);

  const handlePayment = () => {
    window.location.href = "https://razorpay.me/@uskillbook"; // Assuming Razorpay link
  };

  return (
    <div className="container">
      <h2>Order Summary</h2>

      {/* Image Preview */}
      {imageUrl ? (
        <div className="previewContainer">
          <img src={imageUrl} alt="Uploaded Preview" className="previewImg" />
        </div>
      ) : (
        <p>No image uploaded</p>
      )}

      {/* Order Details */}
      <p><strong>Price:</strong> ₹{price || "Not provided"}</p>
      <p><strong>Payment Mode:</strong> {paymentMode || "Not selected"}</p>
      <p><strong>Purchase Type:</strong> {buyType || "Not selected"}</p>

      <button onClick={handlePayment} className="pay-button">
        Pay Now
      </button>

      <button onClick={() => navigate("/")} className="back-button">
        Back to Home
      </button>
    </div>
  );
};

export default OrderSummary;