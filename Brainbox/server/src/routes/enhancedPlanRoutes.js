import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { 
  generateEnhancedPlan, 
  updateTodoItem, 
  deletePlan, 
  clearCompletedTopics 
} from "../controllers/enhancedPlanController.js";

const router = express.Router();

// Generate enhanced plan with TODO structure
router.post("/generate-enhanced", requireAuth, generateEnhancedPlan);

// Update todo item status
router.patch("/:planId/todo", requireAuth, updateTodoItem);

// Delete plan
router.delete("/:id", requireAuth, deletePlan);

// Clear completed topics
router.delete("/:id/completed", requireAuth, clearCompletedTopics);

export default router;
