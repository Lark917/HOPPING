/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backdropBlur: {
        xs: '2px',
      },
      colors: {
        glass: {
          white: 'rgba(255, 255, 255, 0.2)',
          dark: 'rgba(0, 0, 0, 0.2)',
          blue: 'rgba(59, 130, 246, 0.2)',
        }
      }
    },
  },
  plugins: [],
}