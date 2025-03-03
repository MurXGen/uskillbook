const express = require("express");
const Book = require("../models/Book");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const query = req.query.query;
    const books = await Book.find({ name: new RegExp(query, "i") }).limit(5);
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Error fetching books" });
  }
});

module.exports = router;
