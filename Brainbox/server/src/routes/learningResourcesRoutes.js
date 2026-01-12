import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { getLearningResources, updatePlanWithResources } from "../controllers/learningResourcesController.js";

const router = express.Router();

// Get learning resources for a topic
router.get("/", requireAuth, getLearningResources);

// Update plan with learning resources
router.post("/update-plan", requireAuth, updatePlanWithResources);

export default router;
