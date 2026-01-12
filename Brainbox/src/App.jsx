import { useMemo, useState } from "react";

function IconSparkles(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 2l1.3 5.2L18 9l-4.7 1.8L12 16l-1.3-5.2L6 9l4.7-1.8L12 2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M5 13l.7 2.8L8 17l-2.3.9L5 21l-.7-3.1L2 17l2.3-1.2L5 13Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M19 12l.8 3.2L22 16l-2.2.8L19 20l-.8-3.2L16 16l2.2-.8L19 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
      <path
        d="M4 8h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
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
      <path
        d="M4 19V5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M4 19h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
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

function IconMenu(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconX(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconTwitter(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M14.2 10.2 21 3h-1.7l-5.8 6.2L9 3H3l7.1 10.2L3 21h1.7l6.1-6.6L15 21h6l-6.8-10.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconLinkedIn(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M6.5 9.5H4V20h2.5V9.5Zm.3-3.2A1.6 1.6 0 1 1 3.6 6.3a1.6 1.6 0 0 1 3.2 0ZM20 20h-2.5v-5.4c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V20H11V9.5h2.4v1.4h.1c.3-.6 1.2-1.7 2.8-1.7 3 0 3.6 2 3.6 4.6V20Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconFacebook(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M13.5 21v-7h2.3l.4-2.7h-2.7V9.6c0-.8.2-1.3 1.4-1.3H16V6c-.2 0-1.1-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v1.6H7.7V14h2.4v7h3.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconInstagram(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M16.8 3H7.2A4.2 4.2 0 0 0 3 7.2v9.6A4.2 4.2 0 0 0 7.2 21h9.6a4.2 4.2 0 0 0 4.2-4.2V7.2A4.2 4.2 0 0 0 16.8 3Zm1.7 13.8a2.5 2.5 0 0 1-2.5 2.5H8a2.5 2.5 0 0 1-2.5-2.5V8A2.5 2.5 0 0 1 8 5.5h8a2.5 2.5 0 0 1 2.5 2.5v8.8Z"
        fill="currentColor"
      />
      <path
        d="M12 8.2A3.8 3.8 0 1 0 15.8 12 3.8 3.8 0 0 0 12 8.2Zm0 6.2A2.4 2.4 0 1 1 14.4 12 2.4 2.4 0 0 1 12 14.4Z"
        fill="currentColor"
      />
      <path d="M16.4 7.1a.9.9 0 1 0 0 1.8.9.9 0 0 0 0-1.8Z" fill="currentColor" />
    </svg>
  );
}

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [goal, setGoal] = useState("");
  const [timeToComplete, setTimeToComplete] = useState("3 Months");
  const [dailyStudyTime, setDailyStudyTime] = useState("1 hour");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("idle");

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

  const howItWorks = useMemo(
    () => [
      {
        step: "Step 1",
        title: "Enter your learning goal",
        description:
          "Type what you want to learn and choose your target timeline and daily study time.",
      },
      {
        step: "Step 2",
        title: "AI creates your personalized plan",
        description:
          "BrainBox organizes topics, lessons, and resources into a day-by-day study schedule.",
      },
      {
        step: "Step 3",
        title: "Follow the plan and track progress",
        description:
          "Complete tasks, check off lessons, and see your progress toward your goal.",
      },
    ],
    [],
  );

  const useCases = useMemo(
    () => [
      {
        title: "College Student",
        description:
          "Ace courses with structured notes, practice tasks, and revision schedules.",
      },
      {
        title: "Working Professional",
        description:
          "Learn after work with a plan that fits your calendar and keeps you consistent.",
      },
      {
        title: "Interview Preparation",
        description:
          "Target the skills you need and focus on high-frequency topics and practice.",
      },
      {
        title: "Skill Upgrade",
        description:
          "Move into new roles by mastering modern tools, workflows, and projects.",
      },
    ],
    [],
  );

  function onGeneratePlan(e) {
    e.preventDefault();
  }

  function onSubscribe(e) {
    e.preventDefault();
    const email = newsletterEmail.trim();

    if (!email) return;

    setNewsletterStatus("success");
    setNewsletterEmail("");
    window.setTimeout(() => setNewsletterStatus("idle"), 2500);
  }

  return (
    <div
      id="top"
      className="min-h-screen bg-gradient-to-b from-white via-indigo-50/50 to-white text-slate-900"
    >
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/70 backdrop-blur">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <a href="#" className="flex items-center gap-2">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white shadow-sm">
                <IconSparkles className="h-5 w-5" />
              </span>
              <span className="text-base font-semibold tracking-tight">
                BrainBox AI
              </span>
            </a>

            <div className="hidden items-center gap-8 md:flex">
              <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
                <a href="#top" className="hover:text-slate-900">
                  Home
                </a>
                <a href="#features" className="hover:text-slate-900">
                  Explore Courses
                </a>
                <a href="#how-it-works" className="hover:text-slate-900">
                  My Plan
                </a>
                <a href="#use-cases" className="hover:text-slate-900">
                  Dashboard
                </a>
                <a href="#" className="hover:text-slate-900">
                  Login
                </a>
                <a href="#" className="hover:text-slate-900">
                  Sign Up
                </a>
              </div>

              <a
                href="#"
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition duration-200 hover:scale-[1.02] hover:bg-indigo-700 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Get Started
              </a>
            </div>

            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm transition hover:bg-slate-50 md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? (
                <IconX className="h-5 w-5" />
              ) : (
                <IconMenu className="h-5 w-5" />
              )}
            </button>
          </div>

          {mobileOpen ? (
            <div className="pb-4 md:hidden">
              <div className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-700 shadow-sm">
                <a
                  href="#top"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 hover:bg-slate-50"
                >
                  Home
                </a>
                <a
                  href="#features"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 hover:bg-slate-50"
                >
                  Explore Courses
                </a>
                <a
                  href="#how-it-works"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 hover:bg-slate-50"
                >
                  My Plan
                </a>
                <a
                  href="#use-cases"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 hover:bg-slate-50"
                >
                  Dashboard
                </a>
                <a href="#" className="rounded-lg px-3 py-2 hover:bg-slate-50">
                  Login
                </a>
                <a href="#" className="rounded-lg px-3 py-2 hover:bg-slate-50">
                  Sign Up
                </a>
                <a
                  href="#"
                  className="mt-1 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white shadow-sm transition duration-200 hover:scale-[1.02] hover:bg-indigo-700 active:scale-[0.99]"
                >
                  Get Started
                </a>
              </div>
            </div>
          ) : null}
        </nav>
      </header>

      <main>
        <section className="relative overflow-hidden scroll-mt-24" id="hero">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-[-280px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-500/20 via-cyan-400/15 to-transparent blur-3xl" />
            <div className="absolute right-[-180px] top-[260px] h-[420px] w-[420px] rounded-full bg-gradient-to-br from-cyan-400/15 via-indigo-500/10 to-transparent blur-3xl" />
          </div>

          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm motion-safe:animate-fade-in-down">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  AI-powered learning platform
                </div>

                <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900 motion-safe:animate-fade-in-down motion-safe:[animation-delay:120ms] sm:text-5xl">
                  Learn Any Skill Faster with AI-Powered Study Plans
                </h1>

                <p className="mt-4 max-w-xl text-base text-slate-600 motion-safe:animate-fade-in-down motion-safe:[animation-delay:220ms] sm:text-lg">
                  Enter any subject or skill and get personalized notes, resources,
                  and a daily learning schedule in seconds.
                </p>

                <form
                  onSubmit={onGeneratePlan}
                  className="mt-8 motion-safe:animate-fade-in-down motion-safe:[animation-delay:320ms]"
                >
                  <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur sm:p-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="goal"
                          className="mb-1.5 block text-sm font-semibold text-slate-700"
                        >
                          What do you want to learn?
                        </label>
                        <input
                          id="goal"
                          value={goal}
                          onChange={(e) => setGoal(e.target.value)}
                          placeholder="What do you want to learn? (e.g., React, Python, English, Data Science)"
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="time"
                          className="mb-1.5 block text-sm font-semibold text-slate-700"
                        >
                          Time to complete
                        </label>
                        <select
                          id="time"
                          value={timeToComplete}
                          onChange={(e) => setTimeToComplete(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15"
                        >
                          <option>1 Month</option>
                          <option>2 Months</option>
                          <option>3 Months</option>
                          <option>6 Months</option>
                          <option>9 Months</option>
                          <option>12 Months</option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="daily"
                          className="mb-1.5 block text-sm font-semibold text-slate-700"
                        >
                          Daily study time
                        </label>
                        <select
                          id="daily"
                          value={dailyStudyTime}
                          onChange={(e) => setDailyStudyTime(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15"
                        >
                          <option>30 mins</option>
                          <option>1 hour</option>
                          <option>2 hours</option>
                          <option>4 hours</option>
                          <option>6 hours</option>
                          <option>8 hours</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <button
                          type="submit"
                          className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:scale-[1.01] hover:bg-indigo-700 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 motion-safe:animate-pulse-soft motion-safe:hover:animate-none"
                        >
                          Generate My Learning Plan
                        </button>
                        <p className="mt-2 text-xs text-slate-500">
                          Example: “React” + “3 Months” + “1 hour/day”
                        </p>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <div className="relative motion-safe:animate-fade-in-up motion-safe:[animation-delay:420ms]">
                <div className="absolute -inset-6 -z-10 rounded-[32px] bg-gradient-to-br from-indigo-500/15 via-cyan-400/10 to-transparent blur-2xl" />

                <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur sm:p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Today’s Study Plan
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Personalized daily schedule generated by BrainBox AI
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      On track
                    </span>
                  </div>

                  <div className="mt-6 space-y-3">
                    {[
                      {
                        title: "Core concepts",
                        meta: "25 mins • Notes + examples",
                        badge: "Start",
                      },
                      {
                        title: "Guided practice",
                        meta: "20 mins • Exercises",
                        badge: "Practice",
                      },
                      {
                        title: "Quick quiz",
                        meta: "10 mins • Check understanding",
                        badge: "Review",
                      },
                      {
                        title: "Resource picks",
                        meta: "3 links • Video + docs",
                        badge: "Explore",
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {item.title}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            {item.meta}
                          </p>
                        </div>
                        <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                          {item.badge}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-4">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                      <span>Weekly progress</span>
                      <span>62%</span>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
                      <div className="h-2 w-[62%] rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500" />
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      Stay consistent and BrainBox will adjust tomorrow’s tasks automatically.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 scroll-mt-24" id="features">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                Everything you need to learn efficiently
              </h2>
              <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
                BrainBox combines AI-generated notes, curated resources, and a daily plan
                to help you learn any skill faster.
              </p>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {features.map(({ title, description }) => (
                <div
                  key={title}
                  className="group rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-md"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-slate-900">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-start gap-10 lg:grid-cols-2">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                  How it works
                </h2>
                <p className="mt-3 max-w-xl text-sm text-slate-600 sm:text-base">
                  A simple workflow designed for busy students and professionals.
                </p>

                <div className="mt-8 space-y-5">
                  {howItWorks.map((item, idx) => (
                    <div
                      key={item.title}
                      className="flex gap-4 rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-sm font-semibold text-white shadow-sm">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          {item.step}
                        </p>
                        <h3 className="mt-1 text-base font-semibold text-slate-900">
                          {item.title}
                        </h3>
                        <p className="mt-1.5 text-sm text-slate-600">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-6 -z-10 rounded-[32px] bg-gradient-to-br from-cyan-400/10 via-indigo-500/10 to-transparent blur-2xl" />
                <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
                  <p className="text-sm font-semibold text-slate-900">
                    Sample plan preview
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    See how your month is organized at a glance.
                  </p>

                  <div className="mt-6 grid gap-3">
                    {[
                      {
                        week: "Week 1",
                        text: "Foundations + basics",
                        color: "from-indigo-600 to-indigo-400",
                      },
                      {
                        week: "Week 2",
                        text: "Core topics + practice",
                        color: "from-cyan-600 to-cyan-400",
                      },
                      {
                        week: "Week 3",
                        text: "Projects + deep dive",
                        color: "from-emerald-600 to-emerald-400",
                      },
                      {
                        week: "Week 4",
                        text: "Revision + assessment",
                        color: "from-violet-600 to-violet-400",
                      },
                    ].map((w) => (
                      <div
                        key={w.week}
                        className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {w.week}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500">{w.text}</p>
                        </div>
                        <div className="h-2 w-24 rounded-full bg-slate-200">
                          <div
                            className={`h-2 w-16 rounded-full bg-gradient-to-r ${w.color}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-4">
                    <p className="text-xs font-semibold text-slate-600">
                      Personalized for:
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {goal.trim() ? goal.trim() : "Your next skill"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {timeToComplete} • {dailyStudyTime}/day
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Built for every kind of learner
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
              Whether you’re studying, switching careers, or leveling up, BrainBox meets
              you where you are.
            </p>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {useCases.map((c) => (
                <div
                  key={c.title}
                  className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm"
                >
                  <h3 className="text-base font-semibold text-slate-900">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {c.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-br from-indigo-600 to-cyan-500 px-6 py-10 text-white shadow-sm sm:px-10">
              <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                <div>
                  <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                    Start Learning Smarter Today
                  </h2>
                  <p className="mt-3 max-w-xl text-sm text-white/85 sm:text-base">
                    Create your free AI-generated learning plan and make consistent progress
                    every day.
                  </p>
                </div>

                <a
                  href="#"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-indigo-700 shadow-sm transition duration-200 hover:scale-[1.02] hover:bg-indigo-50 active:scale-[0.99] motion-safe:animate-pulse-soft motion-safe:hover:animate-none"
                >
                  Create Free Learning Plan
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-gradient-to-b from-white/60 to-indigo-50/40">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white shadow-sm">
                  <IconSparkles className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold text-slate-900">BrainBox AI</span>
              </div>
              <p className="mt-3 max-w-sm text-sm text-slate-600">
                Learn any skill with AI-generated study plans, notes, and curated resources
                built for students and working professionals.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                {[
                  { label: "Twitter / X", href: "https://example.com", Icon: IconTwitter },
                  { label: "LinkedIn", href: "https://example.com", Icon: IconLinkedIn },
                  { label: "Facebook", href: "https://example.com", Icon: IconFacebook },
                  { label: "Instagram", href: "https://example.com", Icon: IconInstagram },
                ].map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4">
              <p className="text-sm font-semibold text-slate-900">Newsletter</p>
              <p className="mt-2 text-sm text-slate-600">
                Get learning tips, AI study templates, and new course drops.
              </p>

              <form onSubmit={onSubscribe} className="mt-4">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:scale-[1.02] hover:bg-indigo-700 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Subscribe
                  </button>
                </div>

                {newsletterStatus === "success" ? (
                  <p className="mt-2 text-xs font-semibold text-emerald-700">
                    Subscribed! Check your inbox soon.
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-slate-500">
                    No spam. Unsubscribe anytime.
                  </p>
                )}
              </form>
            </div>

            <div className="lg:col-span-4">
              <p className="text-sm font-semibold text-slate-900">Links</p>
              <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm font-medium text-slate-600">
                {[
                  { label: "About", href: "#" },
                  { label: "Contact", href: "#" },
                  { label: "Privacy Policy", href: "#" },
                  { label: "Terms", href: "#" },
                  { label: "GitHub", href: "#" },
                ].map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    className="rounded-lg px-2 py-1 transition duration-200 hover:bg-white hover:text-slate-900"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 SmartLearn AI</p>
            <a
              href="#top"
              className="font-semibold text-slate-600 transition hover:text-slate-900"
            >
              Back to top
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
