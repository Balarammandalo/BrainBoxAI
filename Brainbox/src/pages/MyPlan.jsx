import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiGet, apiPatch, apiPost } from "../lib/api";

export default function MyPlan() {
  const { user, setUser } = useAuth();

  const [goal, setGoal] = useState("");
  const [timeToComplete, setTimeToComplete] = useState("3 Months");
  const [dailyStudyTime, setDailyStudyTime] = useState("1 hour");

  const [resourceTypes, setResourceTypes] = useState(["video", "books", "coding", "deep"]);

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [activeTabByPlanId, setActiveTabByPlanId] = useState({});

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

  function toggleType(type) {
    setResourceTypes((prev) => {
      if (prev.includes(type)) return prev.filter((t) => t !== type);
      return [...prev, type];
    });
  }

  function tabButtonClass(active) {
    return `rounded-xl px-3 py-2 text-sm font-semibold transition ${
      active
        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
    }`;
  }

  function getActiveTab(planId) {
    return activeTabByPlanId[planId] || "Plan";
  }

  function setActiveTab(planId, tab) {
    setActiveTabByPlanId((prev) => ({ ...prev, [planId]: tab }));
  }

  async function setPlanCodingDifficulty(planId, difficulty) {
    const next = String(difficulty || "All");
    try {
      const data = await apiPatch(`/api/plans/${planId}`, { codingDifficulty: next });
      setPlans((prev) => prev.map((p) => (p._id === planId ? data.plan : p)));
    } catch (err) {
      setError(err.message || "Failed to update coding difficulty");
    }
  }

  async function onGenerate(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const data = await apiPost("/api/plans/generate", {
        goal,
        timeToComplete,
        dailyStudyTime,
        resourceTypes,
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
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Select resources
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {[
                    {
                      key: "video",
                      icon: "🎥",
                      label: "Video Learning",
                      desc: "Structured video lessons with embedded players.",
                    },
                    {
                      key: "books",
                      icon: "📚",
                      label: "Books & PDFs",
                      desc: "Upload and read PDFs securely inside the app.",
                    },
                    {
                      key: "coding",
                      icon: "💻",
                      label: "Coding Practice",
                      desc: "Difficulty-filtered problems and interview prep.",
                    },
                    {
                      key: "deep",
                      icon: "📈",
                      label: "Career & Market Intelligence",
                      desc: "Trends, salaries, companies, and job insights.",
                    },
                  ].map((card) => {
                    const active = resourceTypes.includes(card.key);
                    return (
                      <button
                        key={card.key}
                        type="button"
                        onClick={() => toggleType(card.key)}
                        className={`group w-full rounded-2xl border p-4 text-left shadow-sm transition hover:-translate-y-[1px] focus:outline-none focus:ring-4 focus:ring-indigo-500/15 ${
                          active
                            ? "border-indigo-500 bg-indigo-600 text-white"
                            : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${
                              active
                                ? "bg-white/15"
                                : "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200"
                            }`}
                          >
                            <span aria-hidden="true">{card.icon}</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{card.label}</p>
                            <p
                              className={`mt-1 text-xs ${
                                active ? "text-white/80" : "text-slate-600 dark:text-slate-300"
                              }`}
                            >
                              {card.desc}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
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
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                        {p.skill || p.goal}
                      </p>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        {p.duration || p.timeToComplete} • {p.dailyTime || p.dailyStudyTime}/day
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {(p.resourceTypes || []).includes("video") ? (
                          <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                            🎥
                          </span>
                        ) : null}
                        {(p.resourceTypes || []).includes("books") ? (
                          <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                            📚
                          </span>
                        ) : null}
                        {(p.resourceTypes || []).includes("coding") ? (
                          <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                            💻
                          </span>
                        ) : null}
                        {(p.resourceTypes || []).includes("deep") ? (
                          <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                            📈
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Link
                        to="/library"
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                      >
                        Books
                      </Link>
                      <Link
                        to="/market"
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                      >
                        Market View
                      </Link>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {[
                      "Plan",
                      "Resources",
                      "Coding",
                      "Books",
                      "Jobs",
                    ].map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(p._id, tab)}
                        className={tabButtonClass(getActiveTab(p._id) === tab)}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {getActiveTab(p._id) === "Plan" ? (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/50">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Topics
                        </p>
                        <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-200">
                          {(p.topics || []).slice(0, 6).map((t) => (
                            <li key={t}>- {t}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/50">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Day-wise schedule
                        </p>
                        <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-200">
                          {(p.schedule || []).slice(0, 4).map((d) => (
                            <li key={d.day}>
                              Day {d.day}: {d.title}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : null}

                  {getActiveTab(p._id) === "Resources" ? (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/50">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Notes
                        </p>
                        <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-200">
                          {(p.notes || []).slice(0, 6).map((n, idx) => (
                            <li key={idx}>- {n}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/50">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Links
                        </p>
                        <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-200">
                          {(p.resources || []).slice(0, 6).map((r) => (
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

                      {(p.resourcesByType?.video || []).length ? (
                        <div className="sm:col-span-2">
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            Video learning
                          </p>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {(p.resourcesByType?.video || []).slice(0, 4).map((v) => (
                              <div
                                key={v.title}
                                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950"
                              >
                                <iframe
                                  title={v.title}
                                  src={v.url}
                                  className="h-44 w-full"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                                <div className="p-3">
                                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    {v.title}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {getActiveTab(p._id) === "Coding" ? (
                    <div className="mt-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          Coding Problems
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            Difficulty
                          </span>
                          <select
                            value={p.codingDifficulty || "All"}
                            onChange={(e) => setPlanCodingDifficulty(p._id, e.target.value)}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                          >
                            <option>All</option>
                            <option>Easy</option>
                            <option>Medium</option>
                            <option>Hard</option>
                          </select>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3">
                        {(() => {
                          const diff = p.codingDifficulty || "All";
                          const list = p.resourcesByType?.coding || [];
                          const filtered = diff === "All" ? list : list.filter((x) => x.difficulty === diff);
                          if (!filtered.length) {
                            return (
                              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 dark:bg-slate-900/50 dark:text-slate-200">
                                No coding problems found for this difficulty.
                              </div>
                            );
                          }

                          return filtered.slice(0, 12).map((c) => (
                            <div
                              key={`${c.title}-${c.link}`}
                              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    {c.title}
                                  </p>
                                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    Difficulty: {c.difficulty}
                                  </p>
                                </div>
                                <a
                                  href={c.link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                                >
                                  Open
                                </a>
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                  ) : null}

                  {getActiveTab(p._id) === "Books" ? (
                    <div className="mt-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Books</p>
                        <Link
                          to="/library"
                          className="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                        >
                          Upload / Manage
                        </Link>
                      </div>

                      {(p.pdfFiles || []).length ? (
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          {(p.pdfFiles || []).slice(0, 6).map((pdf) => (
                            <div
                              key={pdf.id}
                              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
                            >
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                {pdf.title}
                              </p>
                              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                {(pdf.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                              <div className="mt-3">
                                <Link
                                  to={`/books/${p._id}/${pdf.id}`}
                                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                                >
                                  Read
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 dark:bg-slate-900/50 dark:text-slate-200">
                          No PDFs uploaded for this plan yet.
                        </div>
                      )}
                    </div>
                  ) : null}

                  {getActiveTab(p._id) === "Jobs" ? (
                    <div className="mt-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Jobs</p>
                        <Link
                          to="/market"
                          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                        >
                          Open Market
                        </Link>
                      </div>

                      {(() => {
                        const deep = (p.resourcesByType?.deep || [])[0];
                        const jobs = deep?.jobLinks || [];
                        if (!jobs.length) {
                          return (
                            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 dark:bg-slate-900/50 dark:text-slate-200">
                              No job links available yet for this plan.
                            </div>
                          );
                        }

                        return (
                          <div className="mt-4 grid gap-3">
                            {jobs.slice(0, 8).map((j) => (
                              <div
                                key={`${j.title}-${j.company}-${j.applyUrl}`}
                                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                      {j.title}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                      {j.company} • {j.location}
                                    </p>
                                  </div>
                                  <a
                                    href={j.applyUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                                  >
                                    Apply
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  ) : null}
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
