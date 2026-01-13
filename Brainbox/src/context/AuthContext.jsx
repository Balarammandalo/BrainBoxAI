import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiGet, apiPost } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      const data = await apiGet("/api/auth/me");
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function login({ email, password }) {
    const data = await apiPost("/api/auth/login", { email, password });
    setUser(data.user);
    return data.user;
  }

  async function requestSignupOtp({ name, email, password }) {
    const data = await apiPost("/api/mail/send-otp", { name, email, password });
    return data;
  }

  async function verifySignupOtp({ email, otp }) {
    const data = await apiPost("/api/mail/verify-otp", { email, otp });
    setUser(data.user);
    return data.user;
  }

  async function logout() {
    await apiPost("/api/auth/logout", {});
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, setUser, loading, refresh, login, requestSignupOtp, verifySignupOtp, logout }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
