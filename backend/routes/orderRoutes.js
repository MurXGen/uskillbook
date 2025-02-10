const express = require("express");
const upload = require("../middleware/upload");
const { createOrder } = require("../controllers/orderController");

const router = express.Router();

// Route to create an order with Cloudinary image upload
router.post("/", upload.single("image"), createOrder);

router.get("/", getOrders);

module.exports = router;
