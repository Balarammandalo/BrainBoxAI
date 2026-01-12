import express from "express";

import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  // TODO: Replace with real LinkedIn integration (requires OAuth + approved LinkedIn API access).
  return res.json({
    trending: [
      {
        name: "React",
        demand: "High",
        avgSalary: "$110k-$160k",
        companies: ["Meta", "Netflix", "Uber"],
      },
      {
        name: "Node.js",
        demand: "High",
        avgSalary: "$105k-$155k",
        companies: ["Amazon", "Microsoft", "Stripe"],
      },
      {
        name: "Data Science",
        demand: "Medium",
        avgSalary: "$120k-$180k",
        companies: ["Google", "Apple", "Airbnb"],
      },
    ],
    jobs: [
      {
        id: "lnk-1",
        title: "Frontend Engineer (React)",
        company: "ExampleCorp",
        location: "Remote",
        applyUrl: "https://www.linkedin.com/jobs/search/?keywords=react",
      },
      {
        id: "lnk-2",
        title: "Backend Engineer (Node.js)",
        company: "TechNova",
        location: "Bangalore, India",
        applyUrl: "https://www.linkedin.com/jobs/search/?keywords=nodejs",
      },
      {
        id: "lnk-3",
        title: "Junior Data Analyst",
        company: "DataWorks",
        location: "Hyderabad, India",
        applyUrl: "https://www.linkedin.com/jobs/search/?keywords=data%20analyst",
      },
    ],
  });
});

export default router;
