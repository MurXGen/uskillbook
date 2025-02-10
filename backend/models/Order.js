const mongoose = require("mongoose");

// Function to get the day of the week
const getDayOfWeek = () => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[new Date().getDay()];
};

const OrderSchema = new mongoose.Schema(
  {
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
