import crypto from "crypto";
import express from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";

import Plan from "../models/Plan.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STORAGE_ROOT = path.resolve(__dirname, "../../../storage");

function safeBasename(filename) {
  const base = path.basename(String(filename || ""));
  if (!base || base !== filename) return null;
  if (base.includes("..")) return null;
  return base;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: async (req, file, cb) => {
      try {
        const planId = String(req.params.planId || "");
        if (!planId) return cb(new Error("Missing planId"));

        const plan = await Plan.findOne({ _id: planId, userId: req.user.id });
        if (!plan) return cb(Object.assign(new Error("Plan not found"), { statusCode: 404 }));

        const userId = String(req.user.id);
        const dest = path.join(STORAGE_ROOT, userId, planId, "books");
        ensureDir(dest);
        return cb(null, dest);
      } catch (err) {
        return cb(err);
      }
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname || "").toLowerCase() || ".pdf";
      const id = crypto.randomUUID();
      cb(null, `${id}${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const isPdf = file.mimetype === "application/pdf";
    if (!isPdf) return cb(Object.assign(new Error("Only PDF files are allowed"), { statusCode: 400 }));
    return cb(null, true);
  },
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
});

router.post("/:planId/books/upload", requireAuth, upload.single("file"), async (req, res, next) => {
  try {
    const planId = String(req.params.planId || "");
    const plan = await Plan.findOne({ _id: planId, userId: req.user.id });
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    if (!req.file) {
      return res.status(400).json({ message: "Missing file" });
    }

    const id = crypto.randomUUID();
    const title = String(req.body?.title || "").trim() || path.parse(req.file.originalname).name;

    const pdf = {
      id,
      title,
      filename: req.file.filename,
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadedAt: new Date(),
    };

    plan.pdfFiles = Array.isArray(plan.pdfFiles) ? plan.pdfFiles : [];
    plan.pdfFiles.unshift(pdf);
    await plan.save();

    return res.status(201).json({ pdf });
  } catch (err) {
    return next(err);
  }
});

router.get("/:planId/:filename", requireAuth, async (req, res, next) => {
  try {
    const planId = String(req.params.planId || "");
    const filename = safeBasename(String(req.params.filename || ""));
    if (!filename) return res.status(400).json({ message: "Invalid filename" });

    const plan = await Plan.findOne({ _id: planId, userId: req.user.id });
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    const userId = String(req.user.id);
    const filePath = path.join(STORAGE_ROOT, userId, planId, "books", filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    res.setHeader("Content-Type", "application/pdf");
    return res.sendFile(filePath);
  } catch (err) {
    return next(err);
  }
});

export default router;
