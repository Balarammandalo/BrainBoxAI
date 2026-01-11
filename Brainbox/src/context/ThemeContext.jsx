import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);

function getInitialTheme() {
  const saved = window.localStorage.getItem("bb_theme");
  if (saved === "dark" || saved === "light") return saved;
  return "light";
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");

    window.localStorage.setItem("bb_theme", theme);
  }, [theme]);

  const value = useMemo(
    () => ({ theme, setTheme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
