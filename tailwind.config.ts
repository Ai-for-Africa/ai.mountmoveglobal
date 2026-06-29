import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0f1e3c',
          'navy-mid': '#16213e',
          'navy-deep': '#0a1628',
          gold: '#d4a843',
          'gold-light': '#e8c26a',
          'gold-pale': '#f5e8c0',
          teal: '#00b8a9',
          'teal-dark': '#009688',
          muted: '#8892a4',
        },
      },
      fontFamily: {
        sans: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(1.5rem, 3vw, 2.25rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-sm': ['clamp(1.25rem, 2.5vw, 1.75rem)', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
      },
      spacing: {
        'section': '6rem',
        'section-sm': '4rem',
      },
      maxWidth: {
        'site': '1280px',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out forwards',
        'ticker': 'ticker 28s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
