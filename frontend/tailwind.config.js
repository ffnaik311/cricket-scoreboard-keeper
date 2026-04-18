/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ios-bg': '#000000',
        'ios-card': '#1C1C1E',
        'ios-blue': '#0A84FF',
        'ios-green': '#32D74B',
        'ios-red': '#FF453A',
        'ios-gray': '#8E8E93',
        'ios-text': '#FFFFFF',
      },
      fontFamily: {
        'sans': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      animation: {
        'bounce-soft': 'bounce-soft 1s infinite',
      },
      keyframes: {
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(-5%)', animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)' },
          '50%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' },
        }
      }
    },
  },
  plugins: [],
}
