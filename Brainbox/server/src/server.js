import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDb } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import planRoutes from "./routes/planRoutes.js";

const app = express();

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/BarinBox";
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

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

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Server error";
  res.status(status).json({ message });
});

await connectDb(MONGODB_URI);
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
