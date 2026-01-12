import express from "express";

import Plan from "../models/Plan.js";
import User from "../models/User.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { generateStudyPlan } from "../services/mockAi.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const plans = await Plan.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.json({ plans });
  } catch (err) {
    return next(err);
  }
});

router.post("/generate", requireAuth, async (req, res, next) => {
  try {
    const { goal, timeToComplete, dailyStudyTime, resourceTypes } = req.body || {};

    if (!goal || !timeToComplete || !dailyStudyTime) {
      return res
        .status(400)
        .json({ message: "goal, timeToComplete, dailyStudyTime are required" });
    }

    const ai = generateStudyPlan({ goal, timeToComplete, dailyStudyTime, resourceTypes });

    const plan = await Plan.create({
      userId: req.user.id,
      skill: ai.skill || String(goal || ""),
      duration: ai.duration || timeToComplete,
      dailyTime: ai.dailyTime || dailyStudyTime,
      resourceTypes: Array.isArray(resourceTypes) ? resourceTypes : ai.resourceTypes || [],
      resourcesByType: ai.resourcesByType || undefined,
      goal,
      timeToComplete,
      dailyStudyTime,
      topics: ai.topics,
      notes: ai.notes,
      resources: ai.resources,
      schedule: ai.schedule,
    });

    await User.findByIdAndUpdate(req.user.id, { $addToSet: { learningGoals: goal } });

    return res.status(201).json({ plan });
  } catch (err) {
    return next(err);
  }
});

router.patch("/:id", requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { codingDifficulty } = req.body || {};

    if (!["All", "Easy", "Medium", "Hard"].includes(String(codingDifficulty))) {
      return res.status(400).json({ message: "codingDifficulty must be All, Easy, Medium, or Hard" });
    }

    const plan = await Plan.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { $set: { codingDifficulty: String(codingDifficulty) } },
      { new: true }
    );

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    return res.json({ plan });
  } catch (err) {
    return next(err);
  }
});

export default router;
