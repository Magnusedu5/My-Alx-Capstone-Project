// 📚 LESSON: Tailwind CSS Configuration
// This tells Tailwind which files to scan for CSS classes

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // You can add custom colors, fonts, etc. here
    },
  },
  plugins: [],
}
