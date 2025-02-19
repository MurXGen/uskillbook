const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const orderRoutes = require("./routes/orderRoutes");
const bodyParser = require('body-parser');

dotenv.config();

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: "https://uskillbook.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// // Parse JSON and URL-encoded form data
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true })); 

// //phonepe Route
// const phonepeRoute = require('./routes/phonepeRoute')
// app.use("/api", phonepeRoute);


// Routes
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
