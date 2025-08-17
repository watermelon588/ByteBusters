// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const NGO = require('../models/NGO');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

// Register
router.post('/register', async (req, res) => {
  try {
    const { ngoName, uid, email, password, contactPerson, position, location } = req.body;
    if (!ngoName || !uid || !email || !password || !contactPerson || !position || !location) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const exists = await NGO.findOne({ $or: [{ email }, { uid }] });
    if (exists) return res.status(409).json({ message: 'Email or UID already registered.' });

    const passwordHash = await bcrypt.hash(password, 10);
    const ngo = await NGO.create({ ngoName, uid, email, passwordHash, contactPerson, position, location });

    return res.status(201).json({ message: 'Registered successfully', ngo: {
      id: ngo._id, ngoName: ngo.ngoName, uid: ngo.uid, email: ngo.email,
      contactPerson: ngo.contactPerson, position: ngo.position, location: ngo.location
    }});
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { uid, password, position } = req.body;
    if (!uid || !password || !position) return res.status(400).json({ message: 'UID, password, and position are required.' });

    const ngo = await NGO.findOne({ uid });
    if (!ngo) return res.status(401).json({ message: 'Invalid credentials.' });

    // Optional: also verify the chosen position matches what’s on record
    if (ngo.position !== position) return res.status(401).json({ message: 'Position does not match account.' });

    const ok = await bcrypt.compare(password, ngo.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials.' });

    const token = jwt.sign({ sub: ngo._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      ngo: {
        id: ngo._id,
        ngoName: ngo.ngoName,
        uid: ngo.uid,
        email: ngo.email,
        contactPerson: ngo.contactPerson,
        position: ngo.position,
        location: ngo.location
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
