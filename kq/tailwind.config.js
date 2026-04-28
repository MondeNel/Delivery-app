/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      colors: {
        // Brand
        gold: {
          DEFAULT: '#B8860B',
          light: '#FDF8EE',
          mid: '#E8C97A',
          dark: '#7A5900',
          border: '#E0C86A',
        },
        cream: {
          DEFAULT: '#FAF8F3',
          50: '#FEFDF9',
          100: '#FAF8F3',
          200: '#F2EEE4',
          300: '#E8E2D4',
          400: '#D6CCBA',
        },
        ink: {
          DEFAULT: '#1A1612',
          light: '#3D3530',
          mid: '#6B6058',
          muted: '#9B8F85',
          ghost: '#C8BCB4',
        },
        sage: {
          DEFAULT: '#4A7C59',
          light: '#EAF3EC',
          border: '#A8CEB4',
          text: '#2D5A3D',
        },
        ember: {
          DEFAULT: '#C84B2F',
          light: '#FDF0ED',
          border: '#E8A090',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          raised: '#FEFDF9',
          sunken: '#F2EEE4',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(26,22,18,0.06), 0 4px 12px rgba(26,22,18,0.04)',
        'card': '0 2px 8px rgba(26,22,18,0.08), 0 0 0 1px rgba(26,22,18,0.04)',
        'lifted': '0 8px 24px rgba(26,22,18,0.12), 0 0 0 1px rgba(26,22,18,0.04)',
        'gold': '0 4px 16px rgba(184,134,11,0.2)',
      },
      animation: {
        'fade-up': 'fadeUp 0.4s ease both',
        'slide-in-right': 'slideInRight 0.35s cubic-bezier(0.32,0.72,0,1) both',
        'scale-in': 'scaleIn 0.2s ease both',
        'pulse-gold': 'pulseGold 1.8s infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(12px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        scaleIn: {
          from: { opacity: 0, transform: 'scale(0.95)' },
          to: { opacity: 1, transform: 'scale(1)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(184,134,11,0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(184,134,11,0)' },
        },
      },
    },
  },
  plugins: [],
}