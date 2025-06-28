/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          DEFAULT: '#2C3E50',
          50: '#D5DBDB',
          100: '#C8CFD2',
          200: '#AEB8BF',
          300: '#94A1AC',
          400: '#7A8999',
          500: '#607186',
          600: '#4A5A73',
          700: '#344260',
          800: '#2C3E50',
          900: '#1B252F'
        },
        carrot: {
          DEFAULT: '#E67E22',
          50: '#F8E6D4',
          100: '#F5D9BF',
          200: '#EFBF96',
          300: '#E9A56C',
          400: '#E38C43',
          500: '#E67E22',
          600: '#D26512',
          700: '#A04E0E',
          800: '#6D360A',
          900: '#3B1E05'
        },
        bright: {
          DEFAULT: '#3498DB',
          50: '#EBF5FD',
          100: '#D6EAFC',
          200: '#AED6F8',
          300: '#85C1F5',
          400: '#5DACF1',
          500: '#3498DB',
          600: '#2980B9',
          700: '#21618C',
          800: '#1A4D6B',
          900: '#12384A'
        },
        cloud: {
          DEFAULT: '#ECF0F1',
          50: '#FFFFFF',
          100: '#FFFFFF',
          200: '#FFFFFF',
          300: '#F8F9FA',
          400: '#F4F6F7',
          500: '#ECF0F1',
          600: '#D5DBDC',
          700: '#BDC3C7',
          800: '#A6ACAF',
          900: '#8E9497'
        }
      },
      fontFamily: {
        'display': ['Poppins', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
      boxShadow: {
        'card': '0 4px 8px rgba(0, 0, 0, 0.1)',
        'panel': '0 10px 25px rgba(0, 0, 0, 0.15)',
        'floating': '0 20px 40px rgba(0, 0, 0, 0.2)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ripple': 'ripple 0.6s linear',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        ripple: {
          '0%': {
            transform: 'scale(0)',
            opacity: '1',
          },
          '100%': {
            transform: 'scale(4)',
            opacity: '0',
          },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}