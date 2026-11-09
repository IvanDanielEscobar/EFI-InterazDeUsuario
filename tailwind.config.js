/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        brand: ['"Sedgwick Ave Display"', 'cursive'],
        body: ['"Albert Sans"', 'sans-serif'],
      },
      colors: {
        radar: {
          emergency: '#ef4444',
          delito: '#dc2626',
          sospechoso: '#f97316',
          luz: '#f59e0b',
          baldio: '#0ea5e9',
          acoso: '#8b5cf6',
          infra: '#3b82f6',
          exito: '#10b981',
          dark: '#020617',
          light: '#f8fafc',
        }
      }
    },
  },
  plugins: [],
}
