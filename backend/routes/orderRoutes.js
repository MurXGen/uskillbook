const express = require("express");
const upload = require("../middleware/upload");
const { createOrder } = require("../controllers/orderController");

const router = express.Router();

// Route to create an order, with image upload handled by multer
router.post("/", upload.single("image"), createOrder);

module.exports = router;
