const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cost: { type: Number, required: true },
});

module.exports = mongoose.model("Book", BookSchema);
