import { useEffect } from "react";

export default function Modal({ open, title, children, onClose }) {
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e) {
      if (e.key === "Escape") onClose?.();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
      />
      <div className="relative mx-auto mt-24 w-[92%] max-w-lg">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {title}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              Close
            </button>
          </div>

          <div className="mt-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
