// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    // Add other file paths as needed
  ],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
