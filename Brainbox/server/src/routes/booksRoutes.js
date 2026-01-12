import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { getBooks, generateInterviewPdf } from "../controllers/booksController.js";

const router = express.Router();

// Get books and interview PDFs for a topic
router.get("/", requireAuth, getBooks);

// Generate interview questions PDF
router.post("/generate-interview", requireAuth, generateInterviewPdf);

export default router;
