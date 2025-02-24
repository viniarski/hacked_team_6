/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',

        // Adding color palette
        slate: {
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        white: '#ffffff',
        rose: {
          400: '#fb7185',
          500: '#f43f5e',
        },
        orange: {
          500: '#f97316',
        },
        blue: {
          400: '#60a5fa',
          500: '#3b82f6',
        },
        cyan: {
          500: '#06b6d4',
        },
        amber: {
          500: '#f59e0b',
        },
        yellow: {
          400: '#facc15',
          500: '#eab308',
        },
        green: {
          400: '#4ade80',
          500: '#22c55e',
          900: '#14532d',
        },
        red: {
          400: '#f87171',
          500: '#ef4444',
          900: '#7f1d1d',
        },
        purple: {
          500: '#a855f7',
        },
      },
      backdropBlur: {
        lg: '16px',
      },
      backgroundImage: {
        'gradient-to-b': 'linear-gradient(to bottom, var(--tw-gradient-stops))',
        'gradient-to-r': 'linear-gradient(to right, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
