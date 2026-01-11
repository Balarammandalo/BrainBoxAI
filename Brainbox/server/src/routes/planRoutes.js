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
    const { goal, timeToComplete, dailyStudyTime } = req.body || {};

    if (!goal || !timeToComplete || !dailyStudyTime) {
      return res
        .status(400)
        .json({ message: "goal, timeToComplete, dailyStudyTime are required" });
    }

    const ai = generateStudyPlan({ goal, timeToComplete, dailyStudyTime });

    const plan = await Plan.create({
      userId: req.user.id,
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

export default router;
