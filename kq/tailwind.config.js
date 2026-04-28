/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: '#F5F4F0',
        gold: '#BA7517',
        'gold-light': '#FAEEDA',
        'gold-border': '#EF9F27',
        'text-primary': '#1A1A1A',
        'text-secondary': '#6B7280',
        'text-tertiary': '#9CA3AF',
        'border-light': '#E5E7EB',
        'green-light': '#EAF3DE',
        'green-border': '#97C459',
        'green-text': '#27500A',
        'warm-dark': '#633806',
        'warm-border': '#854F0B',
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
        sans: ['system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'lg': '12px',
        'md': '8px',
      },
    },
  },
  plugins: [],
}