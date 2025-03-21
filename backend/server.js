const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const orderRoutes = require("./routes/orderRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const queryRoutes = require("./routes/queryRoutes");
const bookRoutes = require("./routes/bookRoutes");
const cashflowRoutes = require("./routes/cashflowRoutes");

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
app.use("/api/suppliers", require("./routes/supplierRoutes"));
app.use("/api/orders", orderRoutes);
app.use("/api/queries", queryRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/cashflow", cashflowRoutes);


app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
