import React, { useState, useRef } from "react";
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

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Open the camera when clicking "Click to upload"
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      alert("Camera access denied or unavailable.");
      console.error("Error accessing camera:", error);
    }
  };

  // Capture the photo
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL("image/png");
      setImageUrl(imageDataUrl);
      setImage(imageDataUrl);

      // Stop the camera
      const stream = video.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      video.srcObject = null;
    }
  };

  const handleSubmit = async () => {
    if (!image || !price || !paymentMode || !buyType) {
      alert("Please take a photo, enter a price, and select all options.");
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

      {/* Image Capture Section */}
      <div className="userAction">
        <div className="previewContainer">
          {imageUrl ? (
            <img src={imageUrl} alt="Preview" className="previewImg" />
          ) : (
            <div className="uploadPlaceholder" onClick={openCamera}>
              Click to take a photo
            </div>
          )}
        </div>

        {/* Camera View */}
        <div className="cameraContainer">
          <video ref={videoRef} autoPlay className="cameraFeed"></video>
          {videoRef.current && (
            <button onClick={capturePhoto} className="captureButton">
              Capture
            </button>
          )}
        </div>

        <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

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
              onClick={() => setPaymentMode(paymentMode === "Online Mode" ? "Cash" : "Online Mode")}
            >
              {paymentMode} <span className="material-symbols-outlined">arrow_drop_down_circle</span>
            </div>
          </div>

          {/* Custom Dropdown - Buy Type */}
          <div className="customDropdown">
            <div
              className="dropdownHeader"
              onClick={() => setBuyType(buyType === "Buy" ? "Rent" : "Buy")}
            >
              {buyType} <span className="material-symbols-outlined">arrow_drop_down_circle</span>
            </div>
          </div>
        </div>
      </div>

      {/* Proceed Button */}
      <div className="proceed">
        <button onClick={handleSubmit} className="submit-button">
          Proceed to Summary <span className="material-symbols-outlined">arrow_right</span>
        </button>
      </div>
    </div>
  );
};

export default Checkout;
