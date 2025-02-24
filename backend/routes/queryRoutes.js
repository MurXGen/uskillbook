const express = require("express");
const Query = require("../models/Query");

const router = express.Router();

// Add new query
router.post("/", async (req, res) => {
  try {
    const newQuery = new Query(req.body);
    const savedQuery = await newQuery.save();
    res.status(201).json(savedQuery);
  } catch (err) {
    res.status(500).json({ error: "Failed to add query" });
  }
});

// Get all queries
router.get("/", async (req, res) => {
  try {
    const queries = await Query.find().sort({ createdAt: -1 });
    res.status(200).json(queries);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch queries" });
  }
});

// Update a query
router.put("/:id", async (req, res) => {
  try {
    const updatedQuery = await Query.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedQuery);
  } catch (err) {
    res.status(500).json({ error: "Failed to update query" });
  }
});

// Delete a query
router.delete("/:id", async (req, res) => {
  try {
    await Query.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Query deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete query" });
  }
});

module.exports = router;
