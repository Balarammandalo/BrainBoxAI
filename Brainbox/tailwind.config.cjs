module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        fadeDown: {
          "0%": { opacity: "0", transform: "translateY(-12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.03)" },
        },
        quoteA: {
          "0%, 10%": { opacity: "0", transform: "translateY(6px)" },
          "15%, 45%": { opacity: "1", transform: "translateY(0)" },
          "50%, 100%": { opacity: "0", transform: "translateY(-6px)" },
        },
        quoteB: {
          "0%, 50%": { opacity: "0", transform: "translateY(6px)" },
          "55%, 85%": { opacity: "1", transform: "translateY(0)" },
          "90%, 100%": { opacity: "0", transform: "translateY(-6px)" },
        },
      },
      animation: {
        "fade-in-down": "fadeDown 700ms ease-out both",
        "fade-in-up": "fadeUp 700ms ease-out both",
        "pulse-soft": "pulseSoft 2.4s ease-in-out infinite",
        "quote-a": "quoteA 9s ease-in-out infinite",
        "quote-b": "quoteB 9s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
