/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'theme-teal': '#299578',
        'theme-teal-dark': '#1e7560',
        'theme-teal-light': '#e6f4f0',
        'theme-teal-pale': '#c8e8df',
        'theme-black': '#111714',
        'theme-grey': '#5a6360',
        'theme-light': '#f5f7f6',
        'theme-border': '#dde8e4',
      },
      boxShadow: {
        'theme-glass': '0 8px 32px rgba(41, 149, 120, 0.10)',
      },
      borderRadius: {
        'theme': '14px',
      }
    },
  },
  plugins: [],
}