// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();

// ====== IMPORTANT: MongoDB connection ======
// 1) Direct string (as requested):
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ngo_dashboard";
// If you want to use your own MongoDB Atlas/Local URL, set it in .env as MONGO_URI=your-connection-string

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);

// Serve frontend (optional: if you want to serve static files from Express)
app.use('/', express.static(path.join(__dirname, '..', 'frontend')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
