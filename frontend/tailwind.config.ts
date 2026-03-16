import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0C0C0E',
        surface: {
          DEFAULT: '#17171C',
          hover: '#1E1E25',
        },
        accent: {
          DEFAULT: '#FF4D6D',
          gold: '#FFD166',
        },
        body: '#EEEEF3',
        muted: '#7A7A8C',
        faint: '#3A3A4A',
      },
      fontFamily: {
        sans: ['Karla', '-apple-system', 'sans-serif'],
        serif: ['"Crimson Pro"', 'serif'],
        mono: ['"Fira Code"', 'monospace'],
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        rise: {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease both',
        rise: 'rise 0.55s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
} satisfies Config
