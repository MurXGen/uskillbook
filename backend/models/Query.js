const mongoose = require("mongoose");

const QuerySchema = new mongoose.Schema({
  bookName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  requiredDate: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Query", QuerySchema);
