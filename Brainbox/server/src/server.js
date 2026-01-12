import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDb } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import marketRoutes from "./routes/marketRoutes.js";
import codingRoutes from "./routes/codingRoutes.js";
import booksRoutes from "./routes/booksRoutes.js";
import learningResourcesRoutes from "./routes/learningResourcesRoutes.js";
import enhancedPlanRoutes from "./routes/enhancedPlanRoutes.js";

const app = express();

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
const MONGODB_URI =process.env.MONGO_URI;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

if (!MONGODB_URI) {
  throw new Error("MONGO_URI is not set in environment variables");
}

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/plans", enhancedPlanRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/coding", codingRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/learning-resources", learningResourcesRoutes);

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Server error";
  res.status(status).json({ message });
});

await connectDb(MONGODB_URI);
app.listen(PORT, () => {
  console.log(MONGODB_URI)
  console.log(`API listening on http://localhost:${PORT}`);
});
