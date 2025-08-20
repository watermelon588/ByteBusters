// models/NGO.js
const mongoose = require("mongoose");

const ngoSchema = new mongoose.Schema({
  ngoName: { type: String, required: true },
  uid: { type: String, required: true, unique: true },
  contactPerson: { type: String, required: true },
  position: { type: String, required: true },
  email: { type: String, required: true },
  location: { type: String, required: true },
  password: { type: String, required: true }
});

module.exports = mongoose.model("NGO", ngoSchema);
  
