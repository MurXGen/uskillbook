const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

// Search books by name
router.get("/books/search", async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) return res.status(400).json({ error: "Query is required" });

    const books = await Book.find({ name: new RegExp(query, "i") }).limit(5);
    res.json(books);
  } catch (error) {
    console.error("Error fetching book data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
