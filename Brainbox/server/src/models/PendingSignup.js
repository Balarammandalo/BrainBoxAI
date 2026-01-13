import mongoose from "mongoose";

const pendingSignupSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },

    otpHash: { type: String, required: true },
    otpExpiresAt: { type: Date, required: true },

    resendCount: { type: Number, default: 0 },
    resendWindowStart: { type: Date, default: null },

    verifyAttempts: { type: Number, default: 0 },
    verifyWindowStart: { type: Date, default: null },
    lockedUntil: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("PendingSignup", pendingSignupSchema);
