const express = require("express");
const upload = require("../middleware/upload");
const { createOrder, getOrders, updateOrder, deleteOrder } = require("../controllers/orderController");

const router = express.Router();

// Routes
router.post("/", upload.single("image"), createOrder);
router.get("/", getOrders);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

module.exports = router;
