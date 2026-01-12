import { useState, useEffect } from "react";
import { apiGet, apiPatch } from "../lib/api";

export default function PlanTodoList({ plan }) {
  const [planStructure, setPlanStructure] = useState([]);
  const [progressPercent, setProgressPercent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (plan) {
      setPlanStructure(plan.planStructure || []);
      setProgressPercent(plan.progressPercent || 0);
    }
  }, [plan]);

  async function toggleTodoItem(monthIndex) {
    setLoading(true);
    try {
      const newCompleted = !planStructure[monthIndex].completed;
      const data = await apiPatch(`/api/plans/${plan._id}/todo`, {
        monthIndex,
        completed: newCompleted
      });
      
      if (data.success) {
        setPlanStructure(data.planStructure);
        setProgressPercent(data.progressPercent);
      }
    } catch (err) {
      setError(err.message || "Failed to update todo item");
    } finally {
      setLoading(false);
    }
  }

  async function deletePlan() {
    if (!confirm("Are you sure you want to delete this plan? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/plans/${plan._id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        alert("Plan deleted successfully!");
        window.location.reload(); // Simple refresh for now
      } else {
        const data = await response.json();
        setError(data.message || "Failed to delete plan");
      }
    } catch (err) {
      setError(err.message || "Failed to delete plan");
    }
  }

  async function clearCompletedTopics() {
    if (!confirm("Are you sure you want to clear all completed topics?")) {
      return;
    }

    try {
      const response = await fetch(`/api/plans/${plan._id}/completed`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setPlanStructure(data.planStructure);
        setProgressPercent(data.progressPercent);
        alert("Completed topics cleared successfully!");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to clear completed topics");
      }
    } catch (err) {
      setError(err.message || "Failed to clear completed topics");
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
              Track your progress through {plan.timeToComplete}
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={clearCompletedTopics}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              🧹 Clear Completed
            </button>
            <button
              onClick={deletePlan}
              className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 shadow-sm transition hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-300 dark:hover:bg-rose-900/30"
            >
              ❌ Delete Plan
            </button>
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
        
        {planStructure.length === 0 ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            No plan structure available.
          </p>
        ) : (
          <div className="space-y-3">
            {planStructure.map((item, index) => (
              <div
                key={index}
                className={`rounded-2xl border p-4 transition-all ${
                  item.completed
                    ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
                    : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleTodoItem(index)}
                    disabled={loading}
                    className="mt-1 h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                  />
                  <div className="flex-1">
                    <h5 className={`text-sm font-semibold ${
                      item.completed
                        ? "text-emerald-700 dark:text-emerald-300 line-through"
                        : "text-slate-900 dark:text-slate-100"
                    }`}>
                      {item.title}
                    </h5>
                    
                    {item.topics && item.topics.length > 0 && (
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
                    
                    {item.completedAt && (
                      <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
                        Completed on: {new Date(item.completedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
