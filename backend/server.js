import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import errorHandler from "./middleware/errorHandler.js";

import quizRoutes from "./routes/quizRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import flashcardRoutes from "./routes/flashcardRoutes.js";
import aiRoutes from "./routes/aiRoute.js";
import progressRoutes from "./routes/progressRoutes.js";
import authRoutes from "./routes/authRoutes.js";

import connectDB from "./config/db.js";

// ========================================
// __dirname setup for ES Modules
// ========================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========================================
// Create Express App
// ========================================
const app = express();

// ========================================
// CORS CONFIGURATION
// ========================================
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://brilliant-bischitos-c6e8ae8.netlify.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ========================================
// BODY PARSERS
// ========================================
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ========================================
// DATABASE CONNECTION
// ========================================
connectDB();

// ========================================
// STATIC UPLOADS
// ========================================
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// ========================================
// HEALTH CHECK
// ========================================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Learning Assistant API is running",
    environment: process.env.NODE_ENV || "development",
  });
});

// ========================================
// API ROUTES
// ========================================

app.use("/api/auth", authRoutes);

app.use("/api/documents", documentRoutes);

app.use("/api/flashcards", flashcardRoutes);

app.use("/api/ai", aiRoutes);

app.use("/api/quizzes", quizRoutes);

app.use("/api/progress", progressRoutes);

// ========================================
// ERROR HANDLER
// IMPORTANT: Keep AFTER all routes
// ========================================
app.use(errorHandler);

// ========================================
// 404 HANDLER
// ========================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    statusCode: 404,
    path: req.originalUrl,
  });
});

// ========================================
// START SERVER
// ========================================
const PORT = process.env.PORT || 8085;

app.listen(PORT, () => {
  console.log("========================================");
  console.log("AI Learning Assistant Backend Started");
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`Port: ${PORT}`);
  console.log("========================================");
});

// ========================================
// UNHANDLED PROMISE REJECTIONS
// ========================================
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:");
  console.error(err);

  process.exit(1);
});

// ========================================
// UNCAUGHT EXCEPTIONS
// ========================================
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:");
  console.error(err);

  process.exit(1);
});