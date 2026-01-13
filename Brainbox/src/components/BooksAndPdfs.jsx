import { useState, useEffect } from "react";
import { apiGet } from "../lib/api";

export default function BooksAndPdfs({ plan }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (plan) {
      loadBooksAndPdfs();
    }
  }, [plan]);

  async function loadBooksAndPdfs() {
    setLoading(true);
    setError("");
    try {
      const canonicalBookResources = (plan.resources || []).filter(
        (r) => r && typeof r === "object" && (r.type === "book" || r.kind === "book")
      );

      if (canonicalBookResources.length) {
        setBooks(canonicalBookResources);
        return;
      }

      const topic = plan.skill || plan.goal;
      const data = await apiGet(`/api/books?topic=${encodeURIComponent(topic)}`);
      setBooks(data.books || []);
    } catch (err) {
      setError(err.message || "Failed to load books");
    } finally {
      setLoading(false);
    }
  }

  async function downloadPlanPdf() {
    setDownloadingPdf(true);
    try {
      const res = await fetch(`/api/plans/${plan._id}/pdf`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        const text = await res.text();
        const data = text ? JSON.parse(text) : null;
        throw new Error(data?.message || `Failed to download PDF (${res.status})`);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "plan.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || "Failed to download PDF");
    } finally {
      setDownloadingPdf(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Generate PDF Button */}
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/60">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              📚 Books & Interview Resources
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Curated books and interview materials for: {plan.skill || plan.goal}
            </p>
          </div>
          
          <button
            onClick={downloadPlanPdf}
            disabled={downloadingPdf}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {downloadingPdf ? "Preparing..." : "📄 Download Interview PDF"}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-8 text-center shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/60">
          <p className="text-sm text-slate-600 dark:text-slate-300">Loading books and resources...</p>
        </div>
      ) : (
        <>
          {/* Books Section */}
          <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/60">
            <h4 className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-100">
              📖 Recommended Books
            </h4>
            
            {books.length === 0 ? (
              <p className="text-sm text-slate-600 dark:text-slate-300">No books found.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {books.map((book, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
                  >
                    <div className="flex gap-4">
                      {book.thumbnail && (
                        <img
                          src={book.thumbnail}
                          alt={book.title}
                          className="h-24 w-16 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h5 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {book.title}
                        </h5>
                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                          by {book.author}
                        </p>
                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                          {book.description}
                        </p>
                        
                        <div className="mt-3 flex gap-2">
                          {book.previewUrl && (
                            <a
                              href={book.previewUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                            >
                              Preview
                            </a>
                          )}
                          {book.pdfUrl && (
                            <a
                              href={book.pdfUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                            >
                              PDF
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </>
      )}
    </div>
  );
}
