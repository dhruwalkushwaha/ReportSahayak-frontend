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
      // Wire up the `font-bangers` / `font-comic` utilities used in the UI.
      // These reference the fonts loaded in app/layout.tsx and fall back to
      // system fonts so the app still renders sensibly without network access.
      fontFamily: {
        bangers: ['Bangers', 'Impact', 'Haettenschweiler', 'system-ui', 'cursive'],
        comic: ['"Comic Neue"', '"Comic Sans MS"', 'ui-rounded', 'system-ui', 'cursive'],
      },
    },
  },
  plugins: [],
};
