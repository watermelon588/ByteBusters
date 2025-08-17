const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect("mongodb://localhost:27017/ngoDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected successfully"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Default route
app.get("/", (req, res) => {
  res.send("NGO Backend is running 🚀");
});

// ✅ Use auth routes from auth.js
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);


// ✅ Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

//temp
app.post("/auth/register", (req, res) => {
  console.log("📩 /auth/register route hit!");
  const { username, password } = req.body;
  res.json({ success: true, message: "User registered successfully" });
});

