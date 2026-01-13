import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { apiGet } from "../lib/api";

export default function BookReader() {
  const { planId, bookId } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await apiGet(`/api/plans/${planId}`);
        if (mounted) setPlan(data.plan || null);
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load plans");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const pdf = useMemo(
    () => (plan?.pdfFiles || []).find((f) => String(f.id) === String(bookId)) || null,
    [plan, bookId]
  );

  const src = pdf ? `/api/files/${planId}/${pdf.filename}` : "";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {pdf?.title || "Book Reader"}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {plan?.skill || plan?.goal || ""}
          </p>
        </div>

        <Link
          to="/library"
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          Back to Library
        </Link>
      </div>

      {error ? (
        <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-200">
          {error}
        </div>
      ) : null}

      {loading ? <p className="mt-6 text-sm text-slate-600 dark:text-slate-300">Loading…</p> : null}

      {!loading && !error && !pdf ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
          Book not found.
        </div>
      ) : null}

      {!loading && pdf ? (
        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <iframe title={pdf.title} src={src} className="h-[78vh] w-full" />
        </div>
      ) : null}
    </div>
  );
}
