/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Official tseboIQ Brand Colors
        primary: {
          DEFAULT: '#0A1630', // Navy - trust & intelligence
          light: '#12264F',
        },
        accent: {
          DEFAULT: '#22B4AE', // Teal - AI & innovation
          light: '#4BD0CA',
        },
        neutral: {
          light: '#F8FAFC',
          medium: '#E2E8F0',
          dark: '#94A3B8',
        },
        text: {
          dark: '#0A1630',
          light: '#FFFFFF',
        },
        success: '#10B981',
        error: '#EF4444',
        // Legacy aliases for compatibility
        secondary: '#22B4AE',
        light: '#F8FAFC',
        dark: '#0A1630',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
      },
      lineHeight: {
        'heading': '1.3',
        'body': '1.6',
      },
      borderRadius: {
        'sm': '0.25rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'card': '0px 4px 10px rgba(10, 22, 48, 0.15)',
        'hover': '0px 6px 16px rgba(34, 180, 174, 0.25)',
        'glow': '0 0 20px rgba(34, 180, 174, 0.3)',
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #0A1630 0%, #12264F 40%, #22B4AE 100%)',
        'gradient-button': 'linear-gradient(90deg, #22B4AE 0%, #4BD0CA 100%)',
      },
      transitionDuration: {
        'brand': '250ms',
      },
      transitionTimingFunction: {
        'brand': 'ease-in-out',
      },
    },
  },
  plugins: [],
}
