import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    goal: { type: String, required: true, trim: true },
    timeToComplete: { type: String, required: true },
    dailyStudyTime: { type: String, required: true },
    topics: { type: [String], default: [] },
    notes: { type: [String], default: [] },
    resources: {
      type: [
        {
          title: String,
          url: String,
        },
      ],
      default: [],
    },
    schedule: {
      type: [
        {
          day: Number,
          title: String,
          tasks: [String],
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Plan", planSchema);
