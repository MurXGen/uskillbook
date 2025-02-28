const express = require("express");
const router = express.Router();
const multer = require("multer");
const { createOrder, getOrders, updateOrder, deleteOrder } = require("../controllers/orderController");

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Store files in `uploads/` folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Order routes
router.post("/orders", upload.single("image"), createOrder);
router.get("/orders", getOrders);
router.put("/orders/:id", updateOrder);
router.delete("/orders/:id", deleteOrder);

module.exports = router;
