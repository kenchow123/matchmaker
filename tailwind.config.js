/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans TC"', 'sans-serif'],
      },
      colors: {
        brand: {
          pink: '#f06595',
          orange: '#e8590c',
          green: '#2b8a3e',
        },
      },
    },
  },
  plugins: [],
};
