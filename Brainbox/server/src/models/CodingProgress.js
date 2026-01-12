import mongoose from "mongoose";

const codingProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plan",
    required: true,
  },
  problemId: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    required: true,
    enum: ["codeforces", "leetcode"],
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "in_progress", "solved"],
    default: "pending",
  },
  solvedAt: {
    type: Date,
  },
  timeSpent: {
    type: Number, // in minutes
    default: 0,
  },
}, {
  timestamps: true,
});

// Compound index to prevent duplicate entries
codingProgressSchema.index({ userId: 1, planId: 1, problemId: 1 }, { unique: true });

export default mongoose.model("CodingProgress", codingProgressSchema);
