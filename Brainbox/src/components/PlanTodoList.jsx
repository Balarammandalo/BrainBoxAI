import { useState, useEffect } from "react";
import { apiPost } from "../lib/api";

export default function PlanTodoList({ plan }) {
  const [months, setMonths] = useState([]);
  const [completedMonths, setCompletedMonths] = useState([]);
  const [progressPercent, setProgressPercent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (plan) {
      const nextMonths = Array.isArray(plan.months) ? plan.months : [];
      const nextCompleted = Array.isArray(plan.completedMonths) ? plan.completedMonths : [];
      setMonths(nextMonths);
      setCompletedMonths(nextCompleted);

      const pct = nextMonths.length
        ? Math.round((nextCompleted.length / nextMonths.length) * 100)
        : 0;
      setProgressPercent(pct);
    }
  }, [plan]);

  async function toggleMonth(monthNumber) {
    setLoading(true);
    try {
      const isCompleted = completedMonths.includes(monthNumber);
      if (isCompleted) {
        setError("Unmarking a completed month is not supported yet.");
        return;
      }

      const data = await apiPost(`/api/plans/${plan._id}/mark`, { month: monthNumber });
      const updated = data.plan;
      const nextMonths = Array.isArray(updated.months) ? updated.months : [];
      const nextCompleted = Array.isArray(updated.completedMonths) ? updated.completedMonths : [];

      setMonths(nextMonths);
      setCompletedMonths(nextCompleted);

      const pct = nextMonths.length
        ? Math.round((nextCompleted.length / nextMonths.length) * 100)
        : 0;
      setProgressPercent(pct);
    } catch (err) {
      setError(err.message || "Failed to mark month");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Progress */}
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/60">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              📋 Learning Plan
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Track your progress through {plan.duration || plan.timeToComplete}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-700 dark:text-slate-200">Progress</span>
            <span className="font-bold text-indigo-600">{progressPercent}%</span>
          </div>
          <div className="mt-2 h-3 w-full rounded-full bg-slate-200 dark:bg-slate-700">
            <div 
              className="h-3 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
          {error}
        </div>
      )}

      {/* TODO Items */}
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/60">
        <h4 className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-100">
          Monthly Learning Goals
        </h4>
        
        {months.length === 0 ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            No plan structure available.
          </p>
        ) : (
          <div className="space-y-3">
            {months.map((item) => {
              const monthNumber = Number(item.month);
              const done = completedMonths.includes(monthNumber);
              const title = `Month ${monthNumber}`;

              return (
              <div
                key={monthNumber}
                className={`rounded-2xl border p-4 transition-all ${
                  done
                    ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
                    : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={done}
                    onChange={() => toggleMonth(monthNumber)}
                    disabled={loading}
                    className="mt-1 h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                  />
                  <div className="flex-1">
                    <h5 className={`text-sm font-semibold ${
                      done
                        ? "text-emerald-700 dark:text-emerald-300 line-through"
                        : "text-slate-900 dark:text-slate-100"
                    }`}>
                      {title}
                    </h5>
                    
                    {Array.isArray(item.topics) && item.topics.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Topics:</p>
                        <div className="flex flex-wrap gap-1">
                          {item.topics.map((topic, topicIndex) => (
                            <span
                              key={topicIndex}
                              className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
