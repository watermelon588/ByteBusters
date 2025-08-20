// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const NGO = require("../models/NGO");

const router = express.Router();
const JWT_SECRET = "yoursecret"; // replace with env variable in production

// Register NGO
router.post("/register", async (req, res) => {
  try {
    const { ngoName, uid, contactPerson, position, email, location, password } = req.body;

    if (!ngoName || !uid || !contactPerson || !position || !email || !location || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await NGO.findOne({ uid });
    if (existing) return res.status(400).json({ message: "NGO UID already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const ngo = new NGO({
      ngoName,
      uid,
      contactPerson,
      position,
      email,
      location,
      password: hashedPassword
    });

    await ngo.save();
    res.json({ message: "NGO registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login NGO
router.post("/login", async (req, res) => {
  try {
    const { uid, position, password } = req.body;
    const ngo = await NGO.findOne({ uid, position });
    if (!ngo) return res.status(400).json({ message: "Invalid UID or position" });

    const isMatch = await bcrypt.compare(password, ngo.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: ngo._id }, JWT_SECRET, { expiresIn: "1h" });

    res.json({
      message: "Login successful",
      token,
      ngo
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
