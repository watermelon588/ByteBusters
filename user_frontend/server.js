const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Use local MongoDB by default; allow override via env
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jeevacare';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('MongoDB error:', err.message));

// Feedback Schema
const FeedbackSchema = new mongoose.Schema({
  rating: { type: Number, required: true, min: 1, max: 5 },
  comments: { type: String, default: '' },
  at: { type: Date, default: Date.now }
});

const Feedback = mongoose.model('Feedback', FeedbackSchema);

// POST feedback
app.post('/api/feedback', async (req, res) => {
  try {
    const { rating, comments } = req.body;
    if (!rating) return res.status(400).json({ success: false, message: 'Rating is required' });
    const feedback = await Feedback.create({ rating, comments });
    res.json({ success: true, message: 'Feedback saved successfully!', id: feedback._id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET all feedback
app.get('/api/feedback', async (req, res) => {
  try {
    const data = await Feedback.find().sort({ at: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 User API running on http://localhost:${PORT}`));
