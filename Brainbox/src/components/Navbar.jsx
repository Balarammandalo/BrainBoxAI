import { useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Modal from "./Modal";

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

function IconSun(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 3v2.5M12 18.5V21M4.2 4.2 6 6M18 18l1.8 1.8M3 12h2.5M18.5 12H21M4.2 19.8 6 18M18 6l1.8-1.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function IconMoon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M21 13.2A7.8 7.8 0 0 1 10.8 3 6.9 6.9 0 1 0 21 13.2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function initials(name) {
  const parts = String(name || "").trim().split(/\s+/);
  return (parts[0]?.[0] || "U") + (parts[1]?.[0] || "");
}

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-slate-100 ${
      isActive
        ? "text-slate-900 dark:text-slate-100"
        : "text-slate-600 dark:text-slate-300"
    }`;

  const goals = useMemo(() => user?.learningGoals || [], [user]);

  async function onLogout() {
    await logout();
    setProfileOpen(false);
    navigate("/");
  }

  function onGetStarted() {
    if (!user) {
      navigate("/signup");
      return;
    }
    setProfileModalOpen(true);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/70 backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/60">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white shadow-sm">
              <IconSparkles className="h-5 w-5" />
            </span>
            <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              BrainBox AI
            </span>
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/my-plan" className={navLinkClass}>
              My Plan
            </NavLink>
            {user ? (
              <>
                <NavLink to="/library" className={navLinkClass}>
                  Library
                </NavLink>
                <NavLink to="/market" className={navLinkClass}>
                  Market
                </NavLink>
              </>
            ) : null}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              onClick={toggle}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <IconSun className="h-5 w-5" />
              ) : (
                <IconMoon className="h-5 w-5" />
              )}
            </button>

            {!user ? (
              <>
                <Link
                  to="/login"
                  className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-sm font-semibold text-white">
                    {initials(user.name)}
                  </span>
                  <div className="text-left leading-tight">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {user.email}
                    </p>
                  </div>
                </button>

                {profileOpen ? (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-800 dark:bg-slate-950">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        setProfileModalOpen(true);
                      }}
                      className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900"
                    >
                      My Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/my-plan");
                      }}
                      className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900"
                    >
                      My Plans
                    </button>
                    <button
                      type="button"
                      onClick={onLogout}
                      className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:hover:bg-rose-500/10"
                    >
                      Logout
                    </button>
                  </div>
                ) : null}
              </div>
            )}

            <button
              type="button"
              onClick={onGetStarted}
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition duration-200 hover:scale-[1.02] hover:bg-indigo-700 active:scale-[0.99]"
            >
              Get Started
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm transition hover:bg-slate-50 md:hidden dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
            aria-label="Open menu"
          >
            <span className="text-sm font-semibold">Menu</span>
          </button>
        </div>

        {menuOpen ? (
          <div className="pb-4 md:hidden">
            <div className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-3 text-sm font-medium text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
              <NavLink onClick={() => setMenuOpen(false)} to="/" className={navLinkClass}>
                Home
              </NavLink>
              <NavLink
                onClick={() => setMenuOpen(false)}
                to="/my-plan"
                className={navLinkClass}
              >
                My Plan
              </NavLink>
              {user ? (
                <>
                  <NavLink
                    onClick={() => setMenuOpen(false)}
                    to="/library"
                    className={navLinkClass}
                  >
                    Library
                  </NavLink>
                  <NavLink
                    onClick={() => setMenuOpen(false)}
                    to="/market"
                    className={navLinkClass}
                  >
                    Market
                  </NavLink>
                </>
              ) : null}

              <button
                type="button"
                onClick={() => {
                  toggle();
                }}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                Theme: {theme === "dark" ? "Dark" : "Light"}
              </button>

              {!user ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setProfileModalOpen(true);
                  }}
                  className="rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900"
                >
                  My Profile
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onGetStarted();
                }}
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                Get Started
              </button>
            </div>
          </div>
        ) : null}
      </nav>

      <Modal
        open={profileModalOpen}
        title="Profile Summary"
        onClose={() => setProfileModalOpen(false)}
      >
        {!user ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Please login to view your profile.
          </p>
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {user.name}
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {user.email}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Learning goals
              </p>
              {goals.length ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {goals.map((g) => (
                    <span
                      key={g}
                      className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  No learning goals yet. Generate a plan to add one.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setProfileModalOpen(false);
                navigate("/my-plan");
              }}
              className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              Go to My Plans
            </button>
          </div>
        )}
      </Modal>
    </header>
  );
}
