// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-comic-neue)", "sans-serif"],
        display: ["var(--font-bangers)", "cursive"],
      },
      colors: {
        "brand-bg": "#f8f5ef",
        "brand-text": "#1e2a3a",
        "brand-yellow": "#ffc700",
        "dark-bg": "#121822",
        "dark-text": "#f0f0f0",
      },
      boxShadow: {
        "comic-sm": "4px 4px 0px #000",
        "comic-lg": "8px 8px 0px #000",
        "comic-yellow": "4px 4px 0px #eab308",
      },
    },
  },
  plugins: [],
};