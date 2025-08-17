// backend/models/NGO.js
const mongoose = require('mongoose');

const ngoSchema = new mongoose.Schema(
  {
    ngoName: { type: String, required: true },
    uid: { type: String, required: true, unique: true }, // NGO UID for login
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    contactPerson: { type: String, required: true },
    position: { type: String, enum: ['Secretary', 'President', 'Vice president'], required: true },
    location: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('NGO', ngoSchema);
