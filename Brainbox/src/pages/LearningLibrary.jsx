import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { apiGet, apiPostForm } from "../lib/api";

export default function LearningLibrary() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [plans, setPlans] = useState([]);

  const [selectedPlanId, setSelectedPlanId] = useState("");

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const selectedPlan = useMemo(
    () => plans.find((p) => p._id === selectedPlanId) || null,
    [plans, selectedPlanId]
  );

  async function loadPlans() {
    setLoading(true);
    setError("");
    try {
      const data = await apiGet("/api/plans");
      const nextPlans = data.plans || [];
      setPlans(nextPlans);
      if (!selectedPlanId && nextPlans.length) {
        setSelectedPlanId(nextPlans[0]._id);
      }
    } catch (err) {
      setError(err.message || "Failed to load plans");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onUpload(e) {
    e.preventDefault();
    setError("");

    if (!selectedPlanId) {
      setError("Please select a plan");
      return;
    }

    if (!file) {
      setError("Please choose a PDF file");
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append("title", title);
      form.append("file", file);

      const data = await apiPostForm(`/api/files/${selectedPlanId}/books/upload`, form);

      setPlans((prev) =>
        prev.map((p) =>
          p._id === selectedPlanId
            ? { ...p, pdfFiles: [data.pdf, ...(p.pdfFiles || [])] }
            : p
        )
      );
      setTitle("");
      setFile(null);
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Learning Library
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Upload and read your plan-specific PDFs securely. Files are stored per account and served via
          protected API routes.
        </p>
      </div>

      {error ? (
        <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <p className="mt-6 text-sm text-slate-600 dark:text-slate-300">Loading…</p>
      ) : null}

      {!loading ? (
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Upload PDF</h2>

            <form onSubmit={onUpload} className="mt-4 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Plan
                </label>
                <select
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                >
                  {plans.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.skill || p.goal}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Title (optional)
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., JavaScript Notes"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  PDF file
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200 dark:text-slate-200 dark:file:bg-slate-900 dark:file:text-slate-200 dark:hover:file:bg-slate-800"
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {uploading ? "Uploading…" : "Upload"}
              </button>
            </form>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Your PDFs
              </h2>
              <button
                type="button"
                onClick={loadPlans}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                Refresh
              </button>
            </div>

            {!selectedPlan ? (
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
                Select a plan to view its PDFs.
              </p>
            ) : (selectedPlan.pdfFiles || []).length ? (
              <div className="mt-4 grid gap-3">
                {(selectedPlan.pdfFiles || []).map((pdf) => (
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

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link
                        to={`/books/${selectedPlanId}/${pdf.id}`}
                        className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                      >
                        Read
                      </Link>
                      <a
                        href={`/api/files/${selectedPlanId}/${pdf.filename}`}
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
                No PDFs uploaded for this plan yet.
              </p>
            )}
          </section>
        </div>
      ) : null}
    </div>
  );
}
