/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{html,ts}", // Angular templates + TS files
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#ff2d6b",
          hover: "#e02660",
          glow: "rgba(255, 45, 107, 0.3)",
          soft: "rgba(255, 45, 107, 0.08)",
        },
        dark: {
          bg: "#0a0a0f",
          bg2: "#0f0f16",
          bg3: "#14141f",
          card: "#1a1a28",
          card2: "#202030",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
