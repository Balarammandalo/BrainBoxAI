import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPatch } from "../lib/api";

export default function CodingPractice({ plan, user }) {
  const [platform, setPlatform] = useState("codeforces");
  const [difficulty, setDifficulty] = useState("easy");
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState({});
  const [weeklyGoal, setWeeklyGoal] = useState(15);
  const [searchTerm, setSearchTerm] = useState("");

  // Load problems when platform or difficulty changes
  useEffect(() => {
    if (plan) {
      loadProblems();
      loadProgress();
      calculateWeeklyGoal();
    }
  }, [platform, difficulty, plan]);

  async function loadProblems() {
    setLoading(true);
    setError("");
    try {
      const skill = plan.skill || plan.goal;
      const data = await apiGet(`/api/coding/${platform}/${difficulty}?skill=${encodeURIComponent(skill)}`);
      setProblems(data.problems || []);
    } catch (err) {
      setError(err.message || "Failed to load problems");
    } finally {
      setLoading(false);
    }
  }

  async function loadProgress() {
    try {
      const data = await apiGet(`/api/coding/progress/${plan._id}`);
      const progressMap = {};
      data.progress?.forEach(p => {
        progressMap[p.problemId] = p;
      });
      setProgress(progressMap);
    } catch (err) {
      console.error("Failed to load progress:", err);
    }
  }

  async function updateProblemStatus(problemId, status) {
    try {
      await apiPost(`/api/coding/progress`, {
        planId: plan._id,
        problemId,
        platform,
        status
      });
      
      setProgress(prev => ({
        ...prev,
        [problemId]: { ...prev[problemId], status }
      }));
    } catch (err) {
      setError(err.message || "Failed to update progress");
    }
  }

  function calculateWeeklyGoal() {
    const dailyTime = plan.dailyTime || plan.dailyStudyTime || "1 hour";
    const hoursPerDay = parseInt(dailyTime) || 1;
    const weeklyHours = hoursPerDay * 7;
    
    // Estimate problems per week based on difficulty
    const problemsPerHour = difficulty === "easy" ? 2 : difficulty === "medium" ? 1 : 0.5;
    const goal = Math.round(weeklyHours * problemsPerHour);
    setWeeklyGoal(Math.max(goal, 5)); // Minimum 5 problems per week
  }

  function getDifficultyColor(difficulty) {
    switch (difficulty.toLowerCase()) {
      case "easy": return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "medium": return "text-amber-600 bg-amber-50 border-amber-200";
      case "hard": return "text-rose-600 bg-rose-50 border-rose-200";
      default: return "text-slate-600 bg-slate-50 border-slate-200";
    }
  }

  function getProgressStats() {
    const total = Object.keys(progress).length;
    const solved = Object.values(progress).filter(p => p.status === "solved").length;
    const inProgress = Object.values(progress).filter(p => p.status === "in_progress").length;
    const accuracy = total > 0 ? Math.round((solved / total) * 100) : 0;
    
    return { total, solved, inProgress, accuracy };
  }

  const filteredProblems = problems.filter(problem =>
    problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    problem.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const stats = getProgressStats();

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/60">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              💻 Coding Practice
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Practice problems tailored for: {plan.skill || plan.goal}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-600">{stats.solved}</p>
              <p className="text-xs text-slate-500">Solved</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">{stats.inProgress}</p>
              <p className="text-xs text-slate-500">In Progress</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600">{stats.accuracy}%</p>
              <p className="text-xs text-slate-500">Accuracy</p>
            </div>
          </div>
        </div>

        {/* Weekly Goal */}
        <div className="mt-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-cyan-50 p-4 dark:from-indigo-900/20 dark:to-cyan-900/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                🎯 Weekly Practice Goal
              </p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                You should solve {weeklyGoal} problems this week
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-indigo-600">
                {Math.min(stats.solved, weeklyGoal)}/{weeklyGoal}
              </p>
              <p className="text-xs text-slate-500">Completed</p>
            </div>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
            <div 
              className="h-2 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 transition-all duration-300"
              style={{ width: `${Math.min((stats.solved / weeklyGoal) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/60">
        {/* Platform Selector */}
        <div className="mb-4">
          <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">Platform</p>
          <div className="flex gap-2">
            {["codeforces", "leetcode"].map((p) => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  platform === p
                    ? "bg-indigo-600 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                }`}
              >
                {p === "codeforces" ? "Codeforces" : "LeetCode"}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Selector */}
        <div className="mb-4">
          <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">Difficulty</p>
          <div className="flex gap-2">
            {["easy", "medium", "hard"].map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  difficulty === d
                    ? getDifficultyColor(d)
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                }`}
              >
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div>
          <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">Search Problems</p>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title or tags..."
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Problems List */}
      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-8 text-center shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/60">
          <p className="text-sm text-slate-600 dark:text-slate-300">Loading problems...</p>
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
          {error}
        </div>
      ) : filteredProblems.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-8 text-center shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/60">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {searchTerm ? "No problems found matching your search." : "No problems available for this selection."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredProblems.map((problem) => {
            const problemProgress = progress[problem.id];
            const status = problemProgress?.status || "pending";
            
            return (
              <div
                key={problem.id}
                className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950/60"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                        {problem.title}
                      </h4>
                      <span className={`rounded-full border px-2 py-1 text-xs font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                    </div>
                    
                    <div className="mt-2 flex flex-wrap gap-2">
                      {problem.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {problem.rating && (
                      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        Rating: {problem.rating}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status Buttons */}
                    <div className="flex gap-1">
                      <button
                        onClick={() => updateProblemStatus(problem.id, "in_progress")}
                        disabled={status === "in_progress"}
                        className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                          status === "in_progress"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                            : "border border-slate-200 bg-white text-slate-600 hover:bg-amber-50 hover:text-amber-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-amber-900/20"
                        }`}
                        title="Mark as In Progress"
                      >
                        ⏳ In Progress
                      </button>
                      
                      <button
                        onClick={() => updateProblemStatus(problem.id, "solved")}
                        disabled={status === "solved"}
                        className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                          status === "solved"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                            : "border border-slate-200 bg-white text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-emerald-900/20"
                        }`}
                        title="Mark as Solved"
                      >
                        ✔ Solved
                      </button>
                    </div>

                    {/* Solve Button */}
                    <a
                      href={problem.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                    >
                      Solve
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
