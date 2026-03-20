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
          base: '#f7f5f1',
          surface: '#ffffff',
          elevated: '#f3f0ea',
          overlay: '#ede8df',
        },
        accent: {
          cyan: '#1a8cff',
          purple: '#8b6cff',
          green: '#00af9b',
          amber: '#ffa116',
          red: '#ff5c5c',
          pink: '#ff8f6b',
        },
        text: {
          primary: '#262626',
          secondary: '#4f4f4f',
          muted: '#7d7d7d',
        },
        border: {
          DEFAULT: '#e4ded4',
          bright: '#d3c7b6',
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
          '0%': { boxShadow: '0 8px 20px rgba(255, 161, 22, 0.10)' },
          '100%': { boxShadow: '0 14px 30px rgba(255, 161, 22, 0.18)' },
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
