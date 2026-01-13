import express from "express";
import PDFDocument from "pdfkit";

import Plan from "../models/Plan.js";
import User from "../models/User.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { generateStudyPlan } from "../services/mockAi.js";

const router = express.Router();

function normalizePlanDoc(plan) {
  if (!plan) return null;

  let mutated = false;

  // Canonical fields
  if (!plan.skill && plan.goal) {
    plan.skill = plan.goal;
    mutated = true;
  }
  if (!plan.duration && plan.timeToComplete) {
    plan.duration = plan.timeToComplete;
    mutated = true;
  }
  if (!plan.dailyTime && plan.dailyStudyTime) {
    plan.dailyTime = plan.dailyStudyTime;
    mutated = true;
  }

  // Canonical months: derive from enhanced planStructure if missing
  if ((!Array.isArray(plan.months) || !plan.months.length) && Array.isArray(plan.planStructure) && plan.planStructure.length) {
    plan.months = plan.planStructure.map((item, idx) => ({
      month: Number(item.month || idx + 1),
      topics: Array.isArray(item.topics) ? item.topics : [],
    }));
    mutated = true;
  }

  // Canonical months: derive from legacy topics if missing
  if ((!Array.isArray(plan.months) || !plan.months.length) && Array.isArray(plan.topics) && plan.topics.length) {
    plan.months = [{ month: 1, topics: plan.topics }];
    mutated = true;
  }

  // Canonical completedMonths: derive from planStructure completed flags if missing
  if ((!Array.isArray(plan.completedMonths) || !plan.completedMonths.length) && Array.isArray(plan.planStructure) && plan.planStructure.length) {
    const completed = plan.planStructure
      .map((item, idx) => ({ month: Number(item.month || idx + 1), completed: !!item.completed }))
      .filter((m) => m.completed)
      .map((m) => m.month);

    if (completed.length) {
      plan.completedMonths = completed;
      mutated = true;
    }
  }

  // Backfill legacy progressPercent from canonical completedMonths
  if (Array.isArray(plan.months) && plan.months.length) {
    const completedCount = Array.isArray(plan.completedMonths) ? plan.completedMonths.length : 0;
    const nextProgress = Math.round((completedCount / plan.months.length) * 100);
    if (Number.isFinite(nextProgress) && nextProgress !== Number(plan.progressPercent || 0)) {
      plan.progressPercent = nextProgress;
      mutated = true;
    }
  }

  return { plan, mutated };
}

function parseDailyHours(str) {
  if (!str) return 0;
  const s = String(str).toLowerCase();
  const hourMatch = s.match(/(\d+(?:\.\d+)?)\s*hour/);
  if (hourMatch) return Number(hourMatch[1]);
  const minMatch = s.match(/(\d+)\s*min/);
  if (minMatch) return Number(minMatch[1]) / 60;
  // fallback: try to parse number
  const num = parseFloat(s);
  return Number.isFinite(num) ? num : 0;
}

router.get("/stats", requireAuth, async (req, res, next) => {
  try {
    const plans = await Plan.find({ userId: req.user.id }).sort({ createdAt: -1 });

    const now = new Date();
    const msDay = 24 * 60 * 60 * 1000;

    // days active in last 30 days: distinct createdAt dates
    const daysSet = new Set();
    const daysSet7 = new Set();
    let hoursThisWeek = 0;

    plans.forEach((p) => {
      const d = new Date(p.createdAt || p.updatedAt || now);
      const dayKey = d.toISOString().slice(0, 10);
      const daysAgo = Math.floor((now - d) / msDay);
      if (daysAgo <= 30) daysSet.add(dayKey);
      if (daysAgo <= 6) daysSet7.add(dayKey);
      if (daysAgo <= 6) {
        hoursThisWeek += parseDailyHours(p.dailyStudyTime || p.dailyTime);
      }
    });

    const daysActive = daysSet.size;
    const daysActiveLast7 = daysSet7.size;

    let consistencyBadge = "Bronze";
    if (daysActiveLast7 >= 5) consistencyBadge = "Gold";
    else if (daysActiveLast7 >= 3) consistencyBadge = "Silver";

    return res.json({ daysActive, hoursThisWeek: Number(hoursThisWeek.toFixed(2)), consistencyBadge });
  } catch (err) {
    return next(err);
  }
});

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const plans = await Plan.find({ userId: req.user.id }).sort({ createdAt: -1 });
    const out = [];

    for (const p of plans) {
      const { plan, mutated } = normalizePlanDoc(p);
      if (mutated) {
        await plan.save();
      }
      out.push(plan);
    }

    return res.json({ plans: out });
  } catch (err) {
    return next(err);
  }
});

router.get("/:id([0-9a-fA-F]{24})", requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const planDoc = await Plan.findOne({ _id: id, userId: req.user.id });
    if (!planDoc) {
      return res.status(404).json({ message: "Plan not found" });
    }

    const { plan, mutated } = normalizePlanDoc(planDoc);
    if (mutated) {
      await plan.save();
    }

    return res.json({ plan });
  } catch (err) {
    return next(err);
  }
});

router.post("/:id([0-9a-fA-F]{24})/resources", requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { resources } = req.body || {};

    if (!Array.isArray(resources)) {
      return res.status(400).json({ message: "resources must be an array" });
    }

    const plan = await Plan.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { $push: { resources: { $each: resources } } },
      { new: true }
    );

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    const normalized = normalizePlanDoc(plan);
    if (normalized?.mutated) {
      await normalized.plan.save();
    }

    return res.json({ plan: normalized.plan });
  } catch (err) {
    return next(err);
  }
});
router.post("/:id/mark", async (req, res) => {
  try {
    const { month } = req.body;

    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    const index = plan.completedMonths.indexOf(month);

    if (index > -1) {
      // UNMARK
      plan.completedMonths.splice(index, 1);
    } else {
      // MARK
      plan.completedMonths.push(month);
    }

    await plan.save();
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: "Failed to update month status" });
  }
});


router.post("/:id([0-9a-fA-F]{24})/mark", requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { month } = req.body || {};
    const monthNum = Number(month);

    if (!Number.isInteger(monthNum) || monthNum < 1) {
      return res.status(400).json({ message: "month must be a positive integer" });
    }

    const planDoc = await Plan.findOne({ _id: id, userId: req.user.id });
    if (!planDoc) {
      return res.status(404).json({ message: "Plan not found" });
    }

    const { plan, mutated } = normalizePlanDoc(planDoc);
    if (mutated) {
      await plan.save();
    }

    const months = Array.isArray(plan.months) ? plan.months : [];
    if (!months.length) {
      return res.status(400).json({ message: "Plan has no months to mark" });
    }

    const maxMonth = Math.max(...months.map((m) => Number(m.month || 0)).filter((n) => Number.isFinite(n)));
    if (monthNum > maxMonth) {
      return res.status(400).json({ message: "Invalid month" });
    }

    const current = new Set(Array.isArray(plan.completedMonths) ? plan.completedMonths : []);
    current.add(monthNum);
    plan.completedMonths = Array.from(current).sort((a, b) => a - b);

    plan.progressPercent = Math.round((plan.completedMonths.length / months.length) * 100);
    await plan.save();

    return res.json({ plan });
  } catch (err) {
    return next(err);
  }
});

router.get("/:id([0-9a-fA-F]{24})/pdf", requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const planDoc = await Plan.findOne({ _id: id, userId: req.user.id });
    if (!planDoc) {
      return res.status(404).json({ message: "Plan not found" });
    }

    const { plan, mutated } = normalizePlanDoc(planDoc);
    if (mutated) {
      await plan.save();
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="plan.pdf"');

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    doc.fontSize(20).text("BrainBox AI Study Plan", { align: "center" });
    doc.moveDown();
    doc.fontSize(12);
    doc.text(`Skill: ${plan.skill}`);
    doc.text(`Duration: ${plan.duration}`);
    doc.text(`Daily time: ${plan.dailyTime}`);
    doc.moveDown();

    doc.fontSize(14).text("Monthly Topics", { underline: true });
    doc.moveDown(0.5);

    (plan.months || []).forEach((m) => {
      doc.fontSize(12).text(`Month ${m.month}`, { continued: false });
      (m.topics || []).forEach((t) => {
        doc.text(`- ${t}`, { indent: 20 });
      });
      doc.moveDown(0.5);
    });

    doc.end();
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
      months: [{ month: 1, topics: Array.isArray(ai.topics) ? ai.topics : [] }],
      completedMonths: [],
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
