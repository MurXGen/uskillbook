const express = require("express");
const upload = require("../middleware/upload");
const { createOrder,getOrders } = require("../controllers/orderController");

const router = express.Router();

// Route to create an order with Cloudinary image upload
router.post("/", upload.single("image"), createOrder);

router.get("/", getOrders);

router.get("/ping", (req, res) => {
    res.status(200).json({ message: "Server is alive!" });
  });

module.exports = router;
