import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0d0f",
        panel: "#10151a",
        panel2: "#141a1f",
        line: "#1f2a2f",
        line2: "#2a373d",
        fg: "#d7e2e6",
        muted: "#7c8f96",
        dim: "#4d5c62",
        green: "#39d98a",
        amber: "#e8a33d",
        red: "#e0554f",
      },
      fontFamily: {
        mono: [
          "var(--font-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(57,217,138,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(57,217,138,0.06) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "36px 36px",
      },
      keyframes: {
        pulseline: {
          "0%": { backgroundPosition: "0% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.2" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      animation: {
        pulseline: "pulseline 3.5s linear infinite",
        blink: "blink 1.4s step-start infinite",
        scan: "scan 6s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
