const express = require("express");
const upload = require("../middleware/upload");
const { createOrder, getOrders, updateOrder, deleteOrder } = require("../controllers/orderController");

const router = express.Router();

// Route to create an order with Cloudinary image upload
router.post("/", upload.single("image"), createOrder);

// Route to get all orders
router.get("/", getOrders);

// Route to update an order
router.put("/:id", updateOrder);

// Route to delete an order
router.delete("/:id", deleteOrder);

module.exports = router;
