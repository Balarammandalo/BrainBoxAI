import { useState, useEffect } from "react";
import { apiGet, apiPost } from "../lib/api";

export default function LearningResources({ plan }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedTopics, setExpandedTopics] = useState(new Set());

  useEffect(() => {
    if (plan) {
      // Load existing resources from plan
      const existingResources = plan.resourcesByType?.learningResources || [];
      if (existingResources.length > 0) {
        setResources(existingResources);
      } else {
        // Generate resources if they don't exist
        generateResources();
      }
    }
  }, [plan]);

  async function generateResources() {
    setLoading(true);
    setError("");
    try {
      const topic = plan.skill || plan.goal;
      const data = await apiGet(`/api/learning-resources?topic=${encodeURIComponent(topic)}`);
      setResources([data]);
      
      // Update plan with generated resources
      await apiPost("/api/learning-resources/update-plan", {
        planId: plan._id,
        topic
      });
    } catch (err) {
      setError(err.message || "Failed to load learning resources");
    } finally {
      setLoading(false);
    }
  }

  function toggleTopic(topic) {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topic)) {
      newExpanded.delete(topic);
    } else {
      newExpanded.add(topic);
    }
    setExpandedTopics(newExpanded);
  }

  function getPlatformIcon(platform) {
    const icons = {
      "GeeksforGeeks": "💻",
      "W3Schools": "📘",
      "MDN Docs": "📚",
      "FreeCodeCamp": "🎓",
      "YouTube": "📺",
      "Stack Overflow": "🔍",
      "Coursera": "🎯",
      "Udemy": "📖"
    };
    return icons[platform] || "🔗";
  }

  function getPlatformColor(platform) {
    const colors = {
      "GeeksforGeeks": "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300",
      "W3Schools": "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
      "MDN Docs": "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-900/20 dark:text-purple-300",
      "FreeCodeCamp": "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300",
      "YouTube": "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300"
    };
    return colors[platform] || "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900/20 dark:text-slate-300";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/60">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          🔗 Learning Resources
        </h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Curated learning links and tutorials for: {plan.skill || plan.goal}
        </p>
      </div>

      {error && (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-8 text-center shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/60">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Generating learning resources...
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {resources.map((resource, index) => (
            <div
              key={index}
              className="rounded-3xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/60"
            >
              {/* Topic Header */}
              <div
                className="flex cursor-pointer items-center justify-between p-6 transition hover:bg-slate-50 dark:hover:bg-slate-900/50"
                onClick={() => toggleTopic(resource.topic)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📚</span>
                  <div>
                    <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                      {resource.topic}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {resource.links?.length || 0} learning resources
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                    {resource.links?.length || 0} Links
                  </span>
                  <svg
                    className={`h-5 w-5 text-slate-400 transition-transform ${
                      expandedTopics.has(resource.topic) ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Expandable Links */}
              {expandedTopics.has(resource.topic) && (
                <div className="border-t border-slate-200 p-6 dark:border-slate-800">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {resource.links?.map((link, linkIndex) => (
                      <div
                        key={linkIndex}
                        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{getPlatformIcon(link.platform)}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h5 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                {link.platform}
                              </h5>
                              <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${getPlatformColor(link.platform)}`}>
                                {link.platform}
                              </span>
                            </div>
                            
                            <h6 className="mb-2 text-sm font-medium text-slate-800 dark:text-slate-200">
                              {link.title}
                            </h6>
                            
                            {link.description && (
                              <p className="mb-3 text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                                {link.description}
                              </p>
                            )}
                            
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                            >
                              Open Resource
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
