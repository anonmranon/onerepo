/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        primary: '#f04e23',
        'primary-dark': '#d63d14',
        dark: '#1a1a1a',
        'dark-card': '#2a1a15',
        'dark-secondary': '#242424',
        'light-bg': '#f8f3ef',
        'light-bg2': '#f0ede9',
        'body-dark': '#aaaaaa',
        'body-light': '#555555',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        ticker: 'ticker 35s linear infinite',
        'fade-in': 'fadeIn 0.6s ease-out',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
