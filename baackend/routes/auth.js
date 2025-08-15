const express = require("express");
const bcrypt = require("bcrypt");
const NGO = require("../models/NGO");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, uid, password, position } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newNGO = new NGO({ name, uid, password: hashedPassword, position });
    await newNGO.save();

    res.json({ success: true, message: "NGO registered successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { uid, password } = req.body;
    const ngo = await NGO.findOne({ uid });

    if (!ngo) return res.status(400).json({ success: false, message: "NGO not found" });

    const validPass = await bcrypt.compare(password, ngo.password);
    if (!validPass) return res.status(400).json({ success: false, message: "Invalid password" });

    res.json({ success: true, ngoName: ngo.name, position: ngo.position });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
