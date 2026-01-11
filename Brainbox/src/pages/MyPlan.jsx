import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiGet, apiPost } from "../lib/api";

export default function MyPlan() {
  const { user, setUser } = useAuth();

  const [goal, setGoal] = useState("");
  const [timeToComplete, setTimeToComplete] = useState("3 Months");
  const [dailyStudyTime, setDailyStudyTime] = useState("1 hour");

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const header = useMemo(
    () => ({
      title: "AI-Powered Learning Platform",
      subtitle: "Learn Any Skill Faster with AI-Powered Study Plans",
    }),
    [],
  );

  async function loadPlans() {
    setLoading(true);
    setError("");
    try {
      const data = await apiGet("/api/plans");
      setPlans(data.plans || []);
    } catch (err) {
      setError(err.message || "Failed to load plans");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPlans();
  }, []);

  async function onGenerate(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const data = await apiPost("/api/plans/generate", {
        goal,
        timeToComplete,
        dailyStudyTime,
      });
      setPlans((prev) => [data.plan, ...prev]);
      setGoal("");

      if (user && data.plan?.goal) {
        const nextGoals = Array.from(
          new Set([...(user.learningGoals || []), data.plan.goal]),
        );
        setUser({ ...user, learningGoals: nextGoals });
      }
    } catch (err) {
      setError(err.message || "Failed to generate plan");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {header.title}
          </h1>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
            {header.subtitle}
          </p>

          <form
            onSubmit={onGenerate}
            className="mt-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/60"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  What do you want to learn?
                </label>
                <input
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="What do you want to learn? (e.g., React, Python, English, Data Science)"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Time to complete
                </label>
                <select
                  value={timeToComplete}
                  onChange={(e) => setTimeToComplete(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                >
                  <option>1 Month</option>
                  <option>3 Months</option>
                  <option>6 Months</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Daily study time
                </label>
                <select
                  value={dailyStudyTime}
                  onChange={(e) => setDailyStudyTime(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                >
                  <option>30 mins</option>
                  <option>1 hour</option>
                  <option>2 hours</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:scale-[1.01] hover:bg-indigo-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? "Generating…" : "Generate My AI Study Plan"}
                </button>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Plans are stored in MongoDB and visible only to your account.
                </p>
              </div>
            </div>

            {error ? (
              <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
                {error}
              </div>
            ) : null}
          </form>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Your Plans
            </h2>
            <button
              type="button"
              onClick={loadPlans}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">Loading…</p>
          ) : plans.length ? (
            <div className="mt-4 space-y-4">
              {plans.map((p) => (
                <div
                  key={p._id}
                  className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/60"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                        {p.goal}
                      </p>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        {p.timeToComplete} • {p.dailyStudyTime}/day
                      </p>
                    </div>
                    <span className="inline-flex rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                      Plan
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/50">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Topics
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-200">
                        {(p.topics || []).slice(0, 5).map((t) => (
                          <li key={t}>- {t}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/50">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Day-wise schedule
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-200">
                        {(p.schedule || []).slice(0, 3).map((d) => (
                          <li key={d.day}>
                            Day {d.day}: {d.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/50">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Notes
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-200">
                        {(p.notes || []).slice(0, 3).map((n, idx) => (
                          <li key={idx}>- {n}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/50">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Resources
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-200">
                        {(p.resources || []).slice(0, 3).map((r) => (
                          <li key={r.title}>
                            <a
                              href={r.url}
                              target="_blank"
                              rel="noreferrer"
                              className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200"
                            >
                              {r.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
              No plans yet. Generate your first plan.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
