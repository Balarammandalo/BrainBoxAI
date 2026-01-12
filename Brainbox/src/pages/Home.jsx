import { useMemo, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { apiGet, apiPatch } from "../lib/api";
import { useAuth } from "../context/AuthContext";

function IconNotes(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7 3h8l2 2v16H7V3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9 9h6M9 13h6M9 17h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M15 3v2h2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconCalendar(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7 3v3M17 3v3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M4 8h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M6 5h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 12h7M8.5 16h5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconLink(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconChart(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M4 19V5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4 19h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M8 15v-4M12 15V7m4 8v-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M8 11l4-4 4 3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Home() {
  const { user, refresh } = useAuth();

  const [goal, setGoal] = useState("");
  const [timeToComplete, setTimeToComplete] = useState("3 Months");
  const [dailyStudyTime, setDailyStudyTime] = useState("1 hour");
  const [introVisible, setIntroVisible] = useState(() => {
    try {
      return !window.localStorage.getItem("bb_intro_played");
    } catch (e) {
      return true;
    }
  });
  const videoRef = useRef(null);

  const quotes = [
    "Small progress every day leads to big success.",
    "Your future is built by what you learn today.",
    "Consistency compounds; keep showing up.",
    "Learn today, lead tomorrow.",
  ];
  const [quoteIndex, setQuoteIndex] = useState(0);

  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [resumeGoalEnabled, setResumeGoalEnabled] = useState(!!user?.resumeGoal);

  const features = useMemo(
    () => [
      {
        title: "AI-Powered Notes",
        description:
          "Get concise explanations, examples, and revision-friendly notes generated for your level.",
        Icon: IconNotes,
      },
      {
        title: "Smart Study Plan",
        description:
          "A daily schedule that adapts to your timeline and focuses on the highest-impact topics.",
        Icon: IconCalendar,
      },
      {
        title: "Best Learning Resources",
        description:
          "Curated videos, docs, and practice links so you always know what to learn next.",
        Icon: IconLink,
      },
      {
        title: "Progress Tracking",
        description:
          "Stay consistent with milestones, streaks, and measurable outcomes for every week.",
        Icon: IconChart,
      },
    ],
    [],
  );

  function onGeneratePlan(e) {
    e.preventDefault();
  }

  useEffect(() => {
    const id = setInterval(() => setQuoteIndex((i) => (i + 1) % quotes.length), 6000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let mounted = true;
    async function loadStats() {
      try {
        const data = await apiGet("/api/plans/stats");
        if (mounted) setStats(data);
      } catch (e) {
        // ignore
      }
    }

    async function loadTrends() {
      try {
        const data = await apiGet("/api/market");
        if (mounted) setTrends(data.trending || []);
      } catch (e) {}
    }

    loadStats();
    loadTrends();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setResumeGoalEnabled(!!user?.resumeGoal);
  }, [user]);

  function finishIntro() {
    try {
      window.localStorage.setItem("bb_intro_played", "1");
    } catch (e) {}
    setIntroVisible(false);
    if (videoRef.current) {
      try {
        videoRef.current.pause();
      } catch (e) {}
    }
  }

  async function onToggleResumeGoal(v) {
    setResumeGoalEnabled(v);
    try {
      await apiPatch("/api/auth/me", { resumeGoal: !!v });
      refresh();
    } catch (e) {
      // revert on error
      setResumeGoalEnabled((s) => !s);
    }
  }

  return (
    <div id="top">
      {introVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="relative w-full max-w-4xl px-4">
            <video
              ref={videoRef}
              className="w-full rounded-2xl shadow-xl"
              src="/intro.mp4"
              autoPlay
              muted
              playsInline
              onEnded={finishIntro}
            />
            <div className="absolute right-4 top-4">
              <button
                onClick={finishIntro}
                className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-white/20"
              >
                Skip Intro
              </button>
            </div>
          </div>
        </div>
      )}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-[-280px] h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-500/25 via-cyan-400/15 to-transparent blur-3xl dark:from-indigo-500/20" />
          <div className="absolute right-[-180px] top-[260px] h-[460px] w-[460px] rounded-full bg-gradient-to-br from-cyan-400/15 via-indigo-500/10 to-transparent blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm motion-safe:animate-fade-in-down dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                AI-powered learning platform
              </div>

              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900 motion-safe:animate-fade-in-down motion-safe:[animation-delay:120ms] sm:text-5xl dark:text-slate-100">
                Learn Any Skill Faster with AI-Powered Study Plans
              </h1>

              <p className="mt-4 max-w-xl text-base text-slate-600 motion-safe:animate-fade-in-down motion-safe:[animation-delay:220ms] sm:text-lg dark:text-slate-300">
                Enter any subject or skill and get personalized notes, resources, and a daily
                learning schedule in seconds.
              </p>

              <div className="mt-4">
                <div className="h-10 overflow-hidden">
                  <p
                    key={quoteIndex}
                    className="text-indigo-600 font-semibold text-lg transition-opacity duration-700 dark:text-cyan-300"
                    style={{ opacity: 1 }}
                  >
                    {quotes[quoteIndex]}
                  </p>
                </div>
              </div>

              <form
                onSubmit={onGeneratePlan}
                className="mt-8 motion-safe:animate-fade-in-down motion-safe:[animation-delay:320ms]"
              >
                <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur sm:p-5 dark:border-slate-800 dark:bg-slate-950/60">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="goal"
                        className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200"
                      >
                        What do you want to learn?
                      </label>
                      <input
                        id="goal"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        placeholder="What do you want to learn? (e.g., React, Python, English, Data Science)"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="time"
                        className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200"
                      >
                        Time to complete
                      </label>
                      <select
                        id="time"
                        value={timeToComplete}
                        onChange={(e) => setTimeToComplete(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                      >
                        <option>1 Month</option>
                        <option>2 Months</option>
                        <option>3 Months</option>
                        <option>6 Months</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="daily"
                        className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200"
                      >
                        Daily study time
                      </label>
                      <select
                        id="daily"
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
                      <Link
                        to="/my-plan"
                        className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:scale-[1.01] hover:bg-indigo-700 active:scale-[0.99] motion-safe:animate-pulse-soft motion-safe:hover:animate-none"
                      >
                        Generate My Learning Plan
                      </Link>
                      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        Example: “React” + “3 Months” + “1 hour/day”
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="relative motion-safe:animate-fade-in-up motion-safe:[animation-delay:420ms]">
              <div className="absolute -inset-6 -z-10 rounded-[32px] bg-gradient-to-br from-indigo-500/15 via-cyan-400/10 to-transparent blur-2xl" />

              <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur sm:p-8 dark:border-slate-800 dark:bg-slate-950/60">
                <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white dark:border-slate-800">
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
                    <div className="absolute -right-16 -bottom-16 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,.18),transparent_45%),radial-gradient(circle_at_70%_80%,rgba(99,102,241,.20),transparent_45%)]" />
                  </div>

                  <div className="relative">
                    <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                      AI-inspired loop
                    </p>
                    <p className="mt-2 text-sm font-semibold">
                      Neural gradient animation
                    </p>

                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-white/80">🔥 Learning Streak</h4>
                      <div className="mt-3 flex items-center gap-4">
                        <div className="rounded-xl bg-white/8 p-3 text-white">
                          <div className="text-xs text-white/70">Days active</div>
                          <div className="text-lg font-bold">{stats ? stats.daysActive : "—"}</div>
                        </div>
                        <div className="rounded-xl bg-white/8 p-3 text-white">
                          <div className="text-xs text-white/70">Hours this week</div>
                          <div className="text-lg font-bold">{stats ? stats.hoursThisWeek : "—"}</div>
                        </div>
                        <div className="rounded-xl bg-white/8 p-3 text-white">
                          <div className="text-xs text-white/70">Consistency</div>
                          <div className="text-lg font-bold">{stats ? stats.consistencyBadge : "—"}</div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm text-white/80">Learning for a job?</div>
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={resumeGoalEnabled}
                            onChange={(e) => onToggleResumeGoal(e.target.checked)}
                            className="h-5 w-9 rounded-full bg-white/20 accent-indigo-500"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-4 dark:bg-slate-900/50">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                    <span>Weekly progress</span>
                    <span>62%</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
                    <div className="h-2 w-[62%] rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500" />
                  </div>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    Stay consistent and BrainBox will adjust tomorrow’s tasks automatically.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-gradient-to-b from-white/50 via-indigo-25 to-transparent dark:from-slate-950/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Trending Skills This Week</h3>
            <p className="text-sm text-slate-500">Click a skill to fill the learning box</p>
          </div>

          <div className="mt-4 overflow-x-auto py-3">
            <div className="flex gap-4">
              {(trends.length ? trends : [
                { name: 'React' },
                { name: 'AI' },
                { name: 'Data Science' },
                { name: 'Cloud' },
                { name: 'Cybersecurity' },
              ]).map((t) => (
                <button
                  key={t.name}
                  onClick={() => setGoal(t.name)}
                  className="min-w-[160px] shrink-0 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-left shadow-sm backdrop-blur hover:scale-105 transition-transform dark:border-slate-800 dark:bg-slate-950/60"
                >
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t.demand ? `${t.demand} demand` : 'Trending'}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20" id="features">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
              Everything you need to learn efficiently
            </h2>
            <p className="max-w-2xl text-sm text-slate-600 sm:text-base dark:text-slate-300">
              BrainBox combines AI-generated notes, curated resources, and a daily plan to
              help you learn any skill faster.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ title, description, Icon }) => (
              <div
                key={title}
                className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-md dark:border-slate-800 dark:bg-slate-950/60"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-500/20">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
