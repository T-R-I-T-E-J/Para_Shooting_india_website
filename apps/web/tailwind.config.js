/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#003DA5',
          deep: '#00225A',
        },
        orange: {
          DEFAULT: '#FF671F',
        },
        green: {
          DEFAULT: '#046A38',
          500: '#10B981', // Adding common green shades used in alerts
          600: '#059669',
        },
        gold: {
          DEFAULT: '#C8A415',
        },
        danger: {
          DEFAULT: '#DC2626',
        },
        // Semantic mappings
        primary: {
          DEFAULT: '#003DA5',
          light: '#2563EB',
        },
        accent: {
          DEFAULT: '#FF671F',
        },
        error: {
          DEFAULT: '#DC2626',
        },
        interactive: {
          DEFAULT: '#2563EB', // A standard interactive blue
        },
        success: {
          DEFAULT: '#16A34A',
        },
        warning: {
          DEFAULT: '#D97706',
        },
        // Keeping some neutrals for background
        neutral: {
          50: '#F8FAFC',
          100: '#f5f7fa',
          200: '#E8ECF0',
          300: '#D1D9E0',
          400: '#8B95A5',
          500: '#6B7280',
          600: '#4B5563',
          700: '#2C3E50',
          800: '#1A1A1A',
        },
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      boxShadow: {
        nav: '0 2px 10px rgba(0, 0, 0, 0.05)',
        card: '0 1px 4px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}

