/* Quizzie Backend */

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// MongoDB
// Connection string
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/quizzie";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Schema
const scoreSchema = new mongoose.Schema({
  quizId: {
    type: String,
    required: true,
    index: true,
  },
  userName: {
    type: String,
    required: true,
    trim: true,
  },
  score: {
    type: Number,
    required: true,
    min: 0,
  },
  total: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// Index
scoreSchema.index({ quizId: 1, userName: 1 });
scoreSchema.index({ quizId: 1, percentage: -1, timestamp: -1 });

const Score = mongoose.model("Score", scoreSchema);

/* ─────────────────────────────────
   API ROUTES
───────────────────────────────── */

/**
 * GET /api/scores/:quizId
 * Get all scores for a specific quiz
 */
app.get("/api/scores/:quizId", async (req, res) => {
  try {
    const { quizId } = req.params;
    const scores = await Score.find({ quizId })
      .sort({ percentage: -1, timestamp: -1 })
      .lean();

    res.json({ success: true, scores });
  } catch (error) {
    console.error("Error fetching scores:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/leaderboard/:quizId
 * Get top scores for a specific quiz (max one per user, highest score only)
 */
app.get("/api/leaderboard/:quizId", async (req, res) => {
  try {
    const { quizId } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    // Best scores
    const leaderboard = await Score.aggregate([
      { $match: { quizId } },
      // Sort desc
      { $sort: { percentage: -1, timestamp: -1 } },
      // Group users
      {
        $group: {
          _id: { $toLower: { $trim: { input: "$userName" } } },
          userName: { $first: "$userName" },
          score: { $first: "$score" },
          total: { $first: "$total" },
          percentage: { $first: "$percentage" },
          timestamp: { $first: "$timestamp" },
        },
      },
      // Sort again
      { $sort: { percentage: -1, timestamp: -1 } },
      { $limit: limit },
    ]);

    res.json({ success: true, leaderboard });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/scores
 * Save a new score (will only save if it's the user's highest score)
 */
app.post("/api/scores", async (req, res) => {
  try {
    const { quizId, userName, score, total, percentage } = req.body;

    // Validate
    if (
      !quizId ||
      !userName ||
      score === undefined ||
      !total ||
      percentage === undefined
    ) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    if (
      typeof score !== "number" ||
      typeof total !== "number" ||
      typeof percentage !== "number"
    ) {
      return res.status(400).json({
        success: false,
        error: "Invalid data types",
      });
    }

    const normalizedName = userName.toLowerCase().trim();

    // Find best
    const existingScore = await Score.findOne({
      quizId,
      userName: { $regex: new RegExp("^" + normalizedName + "$", "i") },
    }).sort({ percentage: -1 });

    let result = {
      updated: false,
      isHighScore: false,
    };

    // Higher score
    if (!existingScore || percentage > existingScore.percentage) {
      const newScore = new Score({
        quizId,
        userName: userName.trim(),
        score,
        total,
        percentage,
      });

      await newScore.save();

      result = {
        updated: true,
        isHighScore: true,
      };
    }

    res.json({ success: true, ...result });
  } catch (error) {
    console.error("Error saving score:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/user-score/:quizId/:userName
 * Get a specific user's best score for a quiz
 */
app.get("/api/user-score/:quizId/:userName", async (req, res) => {
  try {
    const { quizId, userName } = req.params;
    const normalizedName = userName.toLowerCase().trim();

    const userScore = await Score.findOne({
      quizId,
      userName: { $regex: new RegExp("^" + normalizedName + "$", "i") },
    })
      .sort({ percentage: -1 })
      .lean();

    res.json({ success: true, score: userScore || null });
  } catch (error) {
    console.error("Error fetching user score:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/scores/:quizId
 * Clear all scores for a quiz (for testing/admin use)
 */
app.delete("/api/scores/:quizId", async (req, res) => {
  try {
    const { quizId } = req.params;
    const result = await Score.deleteMany({ quizId });

    res.json({
      success: true,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting scores:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    mongodb:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// Start
app.listen(PORT, () => {
  console.log(`🚀 Quizzie server running on http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
});
