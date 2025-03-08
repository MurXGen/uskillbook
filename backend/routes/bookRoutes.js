const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

// Route to search books by name
router.get("/search", async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    // Use a case-insensitive regex search to match book names
    const books = await Book.find({ name: { $regex: query, $options: "i" } });

    res.json(books);
  } catch (error) {
    console.error("Error searching books:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
