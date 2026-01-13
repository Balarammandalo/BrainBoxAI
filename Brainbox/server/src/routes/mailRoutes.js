import express from "express";
import { transporter } from "../config/mail.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";

import User from "../models/User.js";
import PendingSignup from "../models/PendingSignup.js";
import { setAuthCookie, signToken } from "../utils/authCookies.js";

const router = express.Router();

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function maskEmail(email) {
  const [local, domain] = String(email || "").split("@");
  if (!local || !domain) return "";
  const start = local.slice(0, 2);
  return `${start}${"*".repeat(Math.max(local.length - 2, 4))}@${domain}`;
}

function hashOtp(otp) {
  const pepper = process.env.OTP_PEPPER || process.env.JWT_SECRET || "dev_otp_pepper_change_me";
  return crypto.createHmac("sha256", pepper).update(String(otp)).digest("hex");
}

function generateOtp() {
  return String(crypto.randomInt(0, 1000000)).padStart(6, "0");
}

function toPublicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    learningGoals: user.learningGoals || [],
    resumeGoal: !!user.resumeGoal,
  };
}

router.post("/send", async (req, res) => {
  const { email } = req.body;

  try {
    await transporter.sendMail({
      from: `"BrainBox" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to BrainBox ",
      html: "<h2>Your email service is working successfully!</h2>",
    });

    res.json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send email" });
  }
});

router.post("/send-otp", async (req, res) => {
  const { name, email, password } = req.body || {};
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const now = new Date();
    let pending = await PendingSignup.findOne({ email: normalizedEmail });

    if (!pending) {
      if (!name || !password) {
        return res.status(400).json({ message: "Name and password are required" });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      pending = await PendingSignup.create({
        name: String(name).trim(),
        email: normalizedEmail,
        passwordHash,
        otpHash: "temp",
        otpExpiresAt: now,
        resendCount: 0,
        resendWindowStart: now,
        verifyAttempts: 0,
        verifyWindowStart: now,
        lockedUntil: null,
      });
    }

    if (!pending.resendWindowStart || now - pending.resendWindowStart > 60 * 60 * 1000) {
      pending.resendWindowStart = now;
      pending.resendCount = 0;
    }

    if (pending.resendCount >= 5) {
      return res.status(429).json({ message: "Too many OTP requests. Try again later." });
    }

    const otp = generateOtp();
    pending.otpHash = hashOtp(otp);
    pending.otpExpiresAt = new Date(now.getTime() + 10 * 60 * 1000);
    pending.resendCount += 1;
    await pending.save();

    await transporter.sendMail({
      from: `"BrainBox" <${process.env.EMAIL_USER}>`,
      to: normalizedEmail,
      subject: "Your BrainBox verification code",
      html: `
        <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.5">
          <h2 style="margin:0 0 12px">Verify your email</h2>
          <p style="margin:0 0 12px">Use this code to finish creating your BrainBox account:</p>
          <div style="font-size:28px;font-weight:700;letter-spacing:6px;padding:12px 16px;border:1px solid #e2e8f0;border-radius:12px;display:inline-block">${otp}</div>
          <p style="margin:12px 0 0;color:#64748b">This code expires in 10 minutes.</p>
          <p style="margin:12px 0 0;color:#64748b">If you didn’t request this, you can ignore this email.</p>
        </div>
      `,
    });

    return res.json({
      success: true,
      message: `OTP has been sent to ${maskEmail(normalizedEmail)}`,
      expiresInSeconds: 600,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
});

router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const pending = await PendingSignup.findOne({ email: normalizedEmail });
    if (!pending) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const now = new Date();
    if (pending.lockedUntil && pending.lockedUntil > now) {
      return res.status(429).json({ message: "Too many attempts. Try again later." });
    }

    if (pending.otpExpiresAt < now) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (!pending.verifyWindowStart || now - pending.verifyWindowStart > 10 * 60 * 1000) {
      pending.verifyWindowStart = now;
      pending.verifyAttempts = 0;
    }

    if (pending.verifyAttempts >= 10) {
      pending.lockedUntil = new Date(now.getTime() + 15 * 60 * 1000);
      await pending.save();
      return res.status(429).json({ message: "Too many attempts. Try again later." });
    }

    const ok = hashOtp(otp) === pending.otpHash;
    if (!ok) {
      pending.verifyAttempts += 1;
      await pending.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      await PendingSignup.deleteOne({ _id: pending._id });
      return res.status(409).json({ message: "Email already in use" });
    }

    const user = await User.create({
      name: pending.name,
      email: normalizedEmail,
      passwordHash: pending.passwordHash,
      learningGoals: [],
      resumeGoal: false,
    });

    const token = signToken({ id: user._id });
    setAuthCookie(res, token);
    await PendingSignup.deleteOne({ _id: pending._id });

    return res.json({ success: true, user: toPublicUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Verification failed" });
  }
});


export default router;
