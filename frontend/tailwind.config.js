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
          base: '#090b12',
          surface: '#10131c',
          elevated: '#171b27',
          overlay: '#1f2533',
        },
        accent: {
          cyan: '#7c8cff',
          purple: '#9f7aea',
          green: '#34d399',
          amber: '#f6ad55',
          red: '#fb7185',
          pink: '#c084fc',
        },
        text: {
          primary: '#eef2ff',
          secondary: '#b7c0d8',
          muted: '#6f7b95',
        },
        border: {
          DEFAULT: '#2a3143',
          bright: '#3a455d',
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
          '0%': { boxShadow: '0 0 5px rgba(124,140,255,0.18)' },
          '100%': { boxShadow: '0 0 20px rgba(159,122,234,0.38)' },
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
