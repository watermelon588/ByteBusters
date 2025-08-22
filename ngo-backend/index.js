//index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect("mongodb+srv://rohitzaxx:Clumsy004@cluster0.gd7p4ny.mongodb.net/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected successfully"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Default route
app.get("/", (req, res) => {
  res.send("NGO Backend is running 🚀");
});

// ✅ Use auth routes from auth.js (support both /auth and /api/auth for compatibility)
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);
app.use("/api/auth", authRoutes);

// ✅ Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

