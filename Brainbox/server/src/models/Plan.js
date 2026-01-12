import mongoose from "mongoose";

const resourceLinkSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    url: { type: String, default: "" },
  },
  { _id: false }
);

const codingProblemSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },
    link: { type: String, default: "" },
  },
  { _id: false }
);

const pdfFileSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const planSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    skill: { type: String, trim: true, default: "" },
    duration: { type: String, default: "" },
    dailyTime: { type: String, default: "" },
    resourceTypes: { type: [String], default: [] },
    codingDifficulty: {
      type: String,
      enum: ["All", "Easy", "Medium", "Hard"],
      default: "All",
    },
    resourcesByType: {
      video: { type: [resourceLinkSchema], default: [] },
      books: { type: [resourceLinkSchema], default: [] },
      coding: { type: [codingProblemSchema], default: [] },
      deep: { type: [mongoose.Schema.Types.Mixed], default: [] },
    },
    pdfFiles: { type: [pdfFileSchema], default: [] },

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
