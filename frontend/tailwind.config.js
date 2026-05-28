/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#060810",
        parchment: "#e8dcc8",
        gold: "#c9a84c",
        "gold-light": "#f0d080",
        ember: "#8b2020",
        "siggy-green": "#39ff14",
        "siggy-green-dim": "#1a7a08",
        "siggy-green-glow": "#00ff4422",
        mist: "#9ca3af",
      },
      fontFamily: {
        title: ["Cinzel", "serif"],
        body: ["EB Garamond", "serif"],
        mono: ["Courier New", "monospace"],
      },
      keyframes: {
        flicker: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
          "75%": { opacity: "0.92" },
        },
        greenPulse: {
          "0%,100%": { boxShadow: "0 0 8px #39ff1433, 0 0 20px #39ff1411" },
          "50%": { boxShadow: "0 0 16px #39ff1466, 0 0 40px #39ff1422" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        flicker: "flicker 3s ease-in-out infinite",
        greenPulse: "greenPulse 3s ease-in-out infinite",
        fadeUp: "fadeUp 0.5s ease forwards",
      },
    },
  },
  plugins: [],
};
