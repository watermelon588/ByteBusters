const mongoose = require("mongoose");

const ngoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  uid: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  position: { type: String, enum: ["Secretary", "President", "Vice President"], required: true }
});

module.exports = mongoose.model("NGO", ngoSchema);
