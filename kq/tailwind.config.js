/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        dark: '#121212',
        surface: '#1E1E1E',
        accent: '#E91E63',
        'accent-light': '#FCE4EC',
        'accent-border': '#F48FB1',
        'green-light': '#1B5E20',
        'green-border': '#4CAF50',
        'green-text': '#A5D6A7',
        'warm-dark': '#FCE4EC',   // used for banner text on accent-light bg
        'warm-border': '#F48FB1',
        'text-secondary': '#D1D5DB',
        'text-tertiary': '#9CA3AF',
        'border-light': '#2A2A2A',
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        'lg': '12px',
        'md': '8px',
      },
    },
  },
  plugins: [],
}