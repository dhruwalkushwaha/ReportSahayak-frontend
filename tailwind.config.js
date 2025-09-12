/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // covers src/app, src/pages, src/components
  ],
  theme: {
    extend: {
      colors: {
        "brand-bg": "#fefce8",
        "brand-text": "#111827",
        "dark-bg": "#1f2937",
        "dark-text": "#f3f4f6",
        "brand-yellow": "#fde047",
        "brand-blue": "#3b82f6",
      },
      fontFamily: {
        sans: ["var(--font-comic-neue)", "ui-sans-serif", "system-ui"],
        display: ["var(--font-bangers)", "cursive"],
      },
      boxShadow: {
        "comic-sm": "2px 2px 0px rgba(0,0,0,0.3)",
        "comic-lg": "4px 4px 0px rgba(0,0,0,0.4)",
        "comic-yellow": "4px 4px 0px rgba(250, 204, 21, 0.8)",
      },
    },
  },
  plugins: [],
};
