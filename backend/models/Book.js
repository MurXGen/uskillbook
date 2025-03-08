const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  cost: { type: Number, required: true },
});

// Prevent re-registering the model
module.exports = mongoose.models.Book || mongoose.model("Book", BookSchema);
