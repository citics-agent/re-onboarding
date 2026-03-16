/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'citics-blue': '#0741DA', // Primary Brand Color
        'citics-turquoise': '#11DAEF', // Accent/Highlight
        'citics-amber': '#FFBF01', // Secondary/Alert
        'citics-lavender': '#E6ECFB', // Light Background
        'citics-black': '#000000',
        'citics-white': '#FFFFFF',
        // Mapping old names to new for compatibility during refactor
        'citics-dark': '#0741DA',
        'citics-gold': '#11DAEF',
        'citics-teal': '#04BFA6',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
