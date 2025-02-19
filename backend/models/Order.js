const mongoose = require("mongoose");

// Function to get the day of the week
const getDayOfWeek = () => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[new Date().getDay()];
};

// Function to generate order ID in the format DD-MM-HH-MM-SS
const generateOrderId = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${day}${month}-${hours}${minutes}${seconds}`;
};

const OrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true, default: generateOrderId }, // Order ID format DDMM-HHMMSS
    imageUrl: { type: String, required: true },
    price: { type: Number, required: true },
    paymentMode: { type: String, required: true },
    buyType: { type: String, required: true },
    orderDate: { type: Date, default: Date.now },
    dayOfWeek: { type: String, default: getDayOfWeek },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
