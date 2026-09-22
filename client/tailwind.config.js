/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        wheelgreen: '#1f9d55',
      },
      keyframes: {
        'bounce-in': {
          '0%': { transform: 'scale(0.6)', opacity: '0' },
          '70%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'bounce-in': 'bounce-in 0.35s ease-out',
      },
    },
  },
  plugins: [],
};
