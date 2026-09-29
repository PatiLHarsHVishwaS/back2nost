/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        retro: {
          dark: '#080A10',
          bg: '#0B0D14',
          card: '#121622',
          cardHover: '#181E2E',
          border: '#1E2538',
          amber: '#FFB020',
          gold: '#FBBF24',
          orange: '#FF5E1E',
          coral: '#FF3366',
          coralDark: '#E11D48',
          cyan: '#00F0FF',
          purple: '#9D4EDD',
          pink: '#FF007F',
          yellow: '#FFDF00',
          cream: '#FFFBEB',
          tan: '#F5E6CC',
        },
      },
      fontFamily: {
        cartoon: ['Fredoka', 'Plus Jakarta Sans', 'sans-serif'],
        sans: ['Outfit', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Space Grotesk', 'sans-serif'],
        pixel: ['VT323', 'monospace'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-amber': '0 0 25px -3px rgba(255, 176, 32, 0.45)',
        'glow-coral': '0 0 25px -3px rgba(255, 51, 102, 0.55)',
        'glow-cyan': '0 0 25px -3px rgba(0, 240, 255, 0.45)',
        'glow-purple': '0 0 25px -3px rgba(157, 78, 221, 0.45)',
        'retro-portal': '0 0 60px rgba(255, 176, 32, 0.4), inset 0 0 40px rgba(157, 78, 221, 0.5)',
        'retro-card': '0 12px 30px -10px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(255, 255, 255, 0.08)',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'float-reverse': 'floatRev 7s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.04)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(2deg)' },
        },
        floatRev: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(10px) rotate(-2deg)' },
        },
      },
    },
  },
  plugins: [],
}
