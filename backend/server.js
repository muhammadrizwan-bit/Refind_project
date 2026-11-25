
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Load environment variables FIRST
dotenv.config();

// Import database and routes AFTER dotenv
const connectDB = require("./config/db.js");
const authRoutes = require("./routes/authRoutes.js");
const { itemsRouter } = require("./routes/ItemsRoutes.js");

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Test route
app.get("/", (req, res) => {
  res.send("ReFind Backend is running!");
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Item routes
app.use("/api/items", itemsRouter);

// Start server after connecting to MongoDB
const PORT = process.env.PORT || 1318;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`ReFind Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
