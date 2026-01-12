import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { getProblems, updateProgress, getProgress } from "../controllers/codingController.js";

const router = express.Router();

// Get coding problems from Codeforces or LeetCode
router.get("/:platform/:difficulty", requireAuth, getProblems);

// Update problem progress
router.post("/progress", requireAuth, updateProgress);

// Get progress for a plan
router.get("/progress/:planId", requireAuth, getProgress);

export default router;
