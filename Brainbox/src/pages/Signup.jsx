import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await signup({ name, email, password });
      navigate("/my-plan");
    } catch (err) {
      setError(err.message || "Sign up failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/60">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Start learning with AI-powered study plans.
        </p>

        {error ? (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
            {error}
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:scale-[1.01] hover:bg-indigo-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Creating…" : "Sign Up"}
          </button>

          <p className="text-center text-sm text-slate-600 dark:text-slate-300">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
