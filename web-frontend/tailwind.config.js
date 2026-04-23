/** @type {import('tailwindcss').Config} */
// NOTE: Using Tailwind v4 with @tailwindcss/postcss.
// Theme tokens (colors, fonts, animations) are defined in src/index.css via @theme {}.
// This file is only needed for content path scanning.
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
