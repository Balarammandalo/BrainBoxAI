import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function maskEmail(email) {
  const [local, domain] = String(email || "").split("@");
  if (!local || !domain) return "";
  const start = local.slice(0, 2);
  return `${start}${"*".repeat(Math.max(local.length - 2, 4))}@${domain}`;
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { requestSignupOtp, verifySignupOtp } = useAuth();

  const emailFromState = location.state?.email;
  const emailFromSession = sessionStorage.getItem("pendingSignupEmail");
  const email = useMemo(
    () => normalizeEmail(emailFromState || emailFromSession),
    [emailFromState, emailFromSession],
  );

  const initialMessage = location.state?.message;

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(initialMessage || "OTP has been sent to your email");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);

  const inputsRef = useRef([]);

  const otp = useMemo(() => digits.join(""), [digits]);
  const otpComplete = otp.length === 6 && /^\d{6}$/.test(otp);

  const [expiresAt, setExpiresAt] = useState(() => {
    const raw = sessionStorage.getItem("pendingSignupOtpExpiresAt");
    const ms = raw ? Number(raw) : NaN;
    return Number.isFinite(ms) ? ms : Date.now() + 10 * 60 * 1000;
  });

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const remainingMs = Math.max(0, expiresAt - now);
  const remainingSeconds = Math.floor(remainingMs / 1000);
  const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, "0");
  const seconds = String(remainingSeconds % 60).padStart(2, "0");

  useEffect(() => {
    inputsRef.current?.[0]?.focus?.();
  }, []);

  useEffect(() => {
    if (!email) {
      setError("Missing email. Please sign up again.");
    }
  }, [email]);

  function onChangeAt(index, value) {
    setError("");

    const v = String(value || "").replace(/\D/g, "");
    if (!v) {
      setDigits((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
      return;
    }

    setDigits((prev) => {
      const next = [...prev];
      const chars = v.split("");
      let i = index;
      for (const ch of chars) {
        if (i > 5) break;
        next[i] = ch;
        i += 1;
      }
      return next;
    });

    const nextIndex = clamp(index + v.length, 0, 5);
    inputsRef.current?.[nextIndex]?.focus?.();
  }

  function onKeyDownAt(index, e) {
    if (e.key === "Backspace") {
      if (digits[index]) {
        return;
      }
      const prevIndex = clamp(index - 1, 0, 5);
      inputsRef.current?.[prevIndex]?.focus?.();
      setDigits((prev) => {
        const next = [...prev];
        next[prevIndex] = "";
        return next;
      });
    }
  }

  async function onVerify(e) {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Missing email. Please sign up again.");
      return;
    }

    if (!otpComplete) {
      setError("Enter the 6-digit OTP");
      return;
    }

    setSubmitting(true);
    try {
      await verifySignupOtp({ email, otp });
      setVerified(true);
      setTimeout(() => {
        sessionStorage.removeItem("pendingSignupEmail");
        sessionStorage.removeItem("pendingSignupOtpExpiresAt");
        navigate("/my-plan");
      }, 800);
    } catch (err) {
      setError(err.message || "Verification failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function onResend() {
    setError("");
    setMessage("");

    if (!email) {
      setError("Missing email. Please sign up again.");
      return;
    }

    setResending(true);
    try {
      const data = await requestSignupOtp({ email });
      setMessage(data?.message || "OTP resent");
      const newExpiresAt = Date.now() + (Number(data?.expiresInSeconds || 600) * 1000);
      setExpiresAt(newExpiresAt);
      sessionStorage.setItem("pendingSignupOtpExpiresAt", String(newExpiresAt));
      setDigits(["", "", "", "", "", ""]);
      inputsRef.current?.[0]?.focus?.();
    } catch (err) {
      setError(err.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/60">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Verify your email
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          We sent a 6-digit code to <span className="font-semibold">{maskEmail(email)}</span>.
        </p>

        <div className="mt-3 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
          <span>Expires in</span>
          <span className={remainingSeconds === 0 ? "text-rose-600" : "text-indigo-600"}>
            {minutes}:{seconds}
          </span>
        </div>

        {message ? (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
            {message}
          </div>
        ) : null}

        {error ? (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
            {error}
          </div>
        ) : null}

        {verified ? (
          <div className="mt-6 flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-2xl font-black text-white shadow-sm">
              ✓
            </div>
          </div>
        ) : (
          <form onSubmit={onVerify} className="mt-6 space-y-4">
            <div className="flex justify-between gap-2">
              {digits.map((d, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputsRef.current[idx] = el)}
                  value={d}
                  onChange={(e) => onChangeAt(idx, e.target.value)}
                  onKeyDown={(e) => onKeyDownAt(idx, e)}
                  inputMode="numeric"
                  maxLength={6}
                  className="h-12 w-12 rounded-xl border border-slate-200 bg-white text-center text-lg font-semibold text-slate-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={submitting || !otpComplete || remainingSeconds === 0}
              className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:scale-[1.01] hover:bg-indigo-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Verifying…" : "Verify"}
            </button>

            <button
              type="button"
              onClick={onResend}
              disabled={resending}
              className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              {resending ? "Resending…" : "Resend OTP"}
            </button>

            <p className="text-center text-sm text-slate-600 dark:text-slate-300">
              Entered the wrong email?{" "}
              <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-700">
                Go back
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
