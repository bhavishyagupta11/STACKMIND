/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        bg: {
          base: '#0d0a07',
          surface: '#15100c',
          elevated: '#1d1712',
          overlay: '#261d16',
        },
        accent: {
          cyan: '#f97316',
          purple: '#f59e0b',
          green: '#84cc16',
          amber: '#fb923c',
          red: '#f43f5e',
          pink: '#fb7185',
        },
        text: {
          primary: '#fff7ed',
          secondary: '#d6c2b3',
          muted: '#8a7463',
        },
        border: {
          DEFAULT: '#33271d',
          bright: '#4a392d',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.4s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(249,115,22,0.18)' },
          '100%': { boxShadow: '0 0 20px rgba(249,115,22,0.48)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
