/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {}
  },
  plugins: []
};
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        geist: ['Geist', 'sans-serif'],
        geistmono: ['Geist Mono', 'monospace'],
      },
    },
  },
};