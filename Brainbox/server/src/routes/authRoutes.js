import express from "express";
import bcrypt from "bcryptjs";

import User from "../models/User.js";
import { clearAuthCookie, setAuthCookie, signToken } from "../utils/authCookies.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

function toPublicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    learningGoals: user.learningGoals || [],
  };
}

router.post("/signup", async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existing = await User.findOne({ email: String(email).toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: String(email).toLowerCase(),
      passwordHash,
      learningGoals: [],
    });

    const token = signToken({ id: user._id });
    setAuthCookie(res, token);

    return res.status(201).json({ user: toPublicUser(user) });
  } catch (err) {
    return next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken({ id: user._id });
    setAuthCookie(res, token);

    return res.json({ user: toPublicUser(user) });
  } catch (err) {
    return next(err);
  }
});

router.post("/logout", async (req, res) => {
  clearAuthCookie(res);
  return res.json({ ok: true });
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    return res.json({ user: toPublicUser(user) });
  } catch (err) {
    return next(err);
  }
});

router.patch("/me", requireAuth, async (req, res, next) => {
  try {
    const { name, learningGoals } = req.body || {};

    const updates = {};
    if (typeof name === "string" && name.trim()) updates.name = name.trim();
    if (Array.isArray(learningGoals)) updates.learningGoals = learningGoals;

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    return res.json({ user: toPublicUser(user) });
  } catch (err) {
    return next(err);
  }
});

export default router;
