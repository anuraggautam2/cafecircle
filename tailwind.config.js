/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          50: '#FDFCFB',
          100: '#F9F7F3',
          200: '#F3EFE7',
          300: '#E8E2D6',
          400: '#D5CCBE',
          500: '#B8ACA0',
        },
        ink: {
          950: '#110F0E',
          900: '#181514',
          800: '#262220',
          700: '#3D3835',
          600: '#5A5450',
          500: '#7B746F',
          400: '#A39C95',
        },
        terracotta: {
          DEFAULT: '#B84A22',
          light: '#CE592E',
          dark: '#963916',
          subtle: '#FAF0EB',
        },
        sage: {
          DEFAULT: '#2D6A4F',
          light: '#40916C',
          dark: '#1B4332',
          subtle: '#EDF5F1',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(24, 21, 20, 0.04), 0 1px 2px rgba(24, 21, 20, 0.02)',
        'card-hover': '0 6px 16px -2px rgba(24, 21, 20, 0.06), 0 2px 6px -1px rgba(24, 21, 20, 0.03)',
        'dropdown': '0 10px 25px -5px rgba(24, 21, 20, 0.1), 0 8px 10px -6px rgba(24, 21, 20, 0.05)',
      },
      borderRadius: {
        'card': '1rem',
      }
    },
  },
  plugins: [],
};
