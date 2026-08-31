/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coral: {
          50: '#FFF5F5',
          100: '#FFEBEA',
          200: '#FFD4D2',
          300: '#FFB2AF',
          400: '#FF8883',
          500: '#FF6B6B', // Main photo coral
          600: '#F05252',
          700: '#D93838',
        },
        cream: {
          50: '#FFFFFF',
          100: '#FFFDFC',
          200: '#FFF9F6',
          300: '#FFF4EE',
          400: '#FAECE4',
        }
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        anton: ['Anton', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
