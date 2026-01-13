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

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String, default: "" },
    thumbnail: { type: String, default: "" },
    pdfUrl: { type: String, default: "" },
    previewUrl: { type: String, default: "" },
    isbn: { type: String, default: "" },
    publishedDate: { type: String, default: "" },
  },
  { _id: false }
);

const interviewPdfSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    filename: { type: String, required: true },
    downloadUrl: { type: String, required: true },
    generatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const todoItemSchema = new mongoose.Schema(
  {
    month: { type: Number, required: true },
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
    topics: { type: [String], default: [] },
  },
  { _id: false }
);

const monthSchema = new mongoose.Schema(
  {
    month: { type: Number, required: true },
    topics: { type: [String], default: [] },
  },
  { _id: false }
);

const learningResourceSchema = new mongoose.Schema(
  {
    topic: { type: String, required: true },
    links: [
      {
        platform: { type: String, required: true }, 
        title: { type: String, required: true },
        url: { type: String, required: true },
        description: { type: String, default: "" },
      },
    ],
  },
  { _id: false }
);

const planSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    skill: { type: String, trim: true, default: "" },
    duration: { type: String, default: "" },
    dailyTime: { type: String, default: "" },

    months: { type: [monthSchema], default: [] },
    completedMonths: { type: [Number], default: [] },
    resourceTypes: { type: [String], default: [] },
    codingDifficulty: {
      type: String,
      enum: ["All", "Easy", "Medium", "Hard"],
      default: "All",
    },
    resourcesByType: {
      video: { type: [resourceLinkSchema], default: [] },
      books: { type: [bookSchema], default: [] },
      coding: { type: [codingProblemSchema], default: [] },
      deep: { type: [mongoose.Schema.Types.Mixed], default: [] },
      interviewPdfs: { type: [interviewPdfSchema], default: [] },
      learningResources: { type: [learningResourceSchema], default: [] },
    },
    pdfFiles: { type: [pdfFileSchema], default: [] },
    
    // TODO list structure
    planStructure: { type: [todoItemSchema], default: [] },
    
    // Progress tracking
    progressPercent: { type: Number, default: 0 },
    
    goal: { type: String, trim: true, default: "" },
    timeToComplete: { type: String, default: "" },
    dailyStudyTime: { type: String, default: "" },
    topics: { type: [String], default: [] },
    notes: { type: [String], default: [] },
    resources: { type: [mongoose.Schema.Types.Mixed], default: [] },
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
