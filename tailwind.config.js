/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0B132B',
          800: '#1C2541',
          700: '#3A506B',
          600: '#4A6572',
        },
        brand: {
          purple: '#7C3AED',
          lightPurple: '#A78BFA',
          cyan: '#06B6D4',
          lightBlue: '#38BDF8',
          bgDark: '#0A0F1D',
          cardDark: '#131B2E',
          borderDark: '#1E293B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
