/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // <--- THIS IS KEY
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        bangers: ['"Impact"', '"Arial Black"', "system-ui", "sans-serif"],
        comic: ['"Comic Sans MS"', '"Segoe Print"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
