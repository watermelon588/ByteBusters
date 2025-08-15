const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Replace this with your actual MongoDB URI
mongoose.connect('<your-mongodb-uri>', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
}).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error(err));

// Feedback Schema
const FeedbackSchema = new mongoose.Schema({
  rating: Number,
  comments: String,
  at: { type: Date, default: Date.now }
});

const Feedback = mongoose.model('Feedback', FeedbackSchema);

// POST feedback
app.post('/feedback', async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.json({ success: true, message: 'Feedback saved successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET all feedback
app.get('/feedback', async (req, res) => {
  try {
    const data = await Feedback.find().sort({ at: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
