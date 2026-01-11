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

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-gradient-to-b from-white/60 to-indigo-50/40 dark:border-slate-800 dark:from-slate-950/40 dark:to-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              BrainBox AI
            </p>
            <p className="mt-3 max-w-sm text-sm text-slate-600 dark:text-slate-300">
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
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Newsletter
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Get learning tips, AI study templates, and new course drops.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-4"
              aria-label="Newsletter"
            >
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:scale-[1.02] hover:bg-indigo-700 active:scale-[0.99]"
                >
                  Subscribe
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                No spam. Unsubscribe anytime.
              </p>
            </form>
          </div>

          <div className="lg:col-span-4">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Links
            </p>
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm font-medium text-slate-600 dark:text-slate-300">
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
                  className="rounded-lg px-2 py-1 transition duration-200 hover:bg-white hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-white"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:text-slate-400">
          <p>© 2026 SmartLearn AI</p>
          <a
            href="#top"
            className="font-semibold text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
