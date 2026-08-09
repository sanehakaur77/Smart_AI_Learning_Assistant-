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

// ==============================
// __dirname setup
// ==============================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==============================
// Create Express App
// ==============================

const app = express();

// ==============================
// CORS CONFIGURATION
// ==============================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8084",
  "https://merry-flan-acfdd4.netlify.app/",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an origin
      // Example: Postman, server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked by CORS:", origin);

      return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// ==============================
// Handle preflight requests
// ==============================

app.options("*", cors());

// ==============================
// BODY PARSERS
// ==============================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ==============================
// Connect MongoDB
// ==============================

connectDB();

// ==============================
// Static uploads folder
// ==============================

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// ==============================
// API ROUTES
// ==============================

app.use("/api/auth", authRoutes);

app.use("/api/documents", documentRoutes);

app.use("/api/flashcards", flashcardRoutes);

app.use("/api/ai", aiRoutes);

app.use("/api/quizzes", quizRoutes);

app.use("/api/progress", progressRoutes);

// ==============================
// Error Handler
// ==============================

// Keep this AFTER your API routes
app.use(errorHandler);

// ==============================
// 404 HANDLER
// ==============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    statusCode: 404,
  });
});

// ==============================
// START SERVER
// ==============================

const PORT = process.env.PORT || 8084;

app.listen(PORT, () => {
  console.log(
    `Server running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  );
});

// ==============================
// UNHANDLED PROMISE REJECTIONS
// ==============================

process.on("unhandledRejection", (err) => {
  console.error(`Error: ${err.message}`);

  process.exit(1);
});