/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0e17',
          surface: '#111827',
          card: '#161f30',
          cardHover: '#1c273c',
          border: '#1f2d42',
          borderLight: '#2e3f5b',
          muted: '#64748b',
          text: '#f8fafc',
          subtext: '#94a3b8'
        },
        brand: {
          primary: '#0ea5e9',
          secondary: '#06b6d4',
          accent: '#3b82f6',
          indigo: '#6366f1',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
          purple: '#a855f7'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -5px rgba(6, 182, 212, 0.25)',
        'glow-blue': '0 0 20px -5px rgba(14, 165, 233, 0.25)',
        'glow-indigo': '0 0 20px -5px rgba(99, 102, 241, 0.25)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.45)',
      }
    },
  },
  plugins: [],
}
