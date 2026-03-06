import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0b0b0b',
        surface: '#161616',
        'surface-light': '#1e1e1e',
        foreground: '#e8e8e8',
        'foreground-muted': '#888888',
        crimson: {
          DEFAULT: '#b11226',
          light: '#d4182f',
          dark: '#8a0e1e',
        },
        gold: '#c9a96e',
        border: '#2a2a2a',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;
