/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Clash Display', 'sans-serif'],
        body: ['Satoshi', 'sans-serif'],
      },
      borderRadius: {
        lg: '0.25rem',
        md: '0.25rem',
        sm: '0.125rem'
      },
      colors: {
        background: '#FAFAFA',
        foreground: '#050505',
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#050505'
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#050505'
        },
        primary: {
          DEFAULT: '#06B6D4',
          foreground: '#FFFFFF'
        },
        secondary: {
          DEFAULT: '#525252',
          foreground: '#050505'
        },
        muted: {
          DEFAULT: '#F5F5F5',
          foreground: '#525252'
        },
        accent: {
          DEFAULT: '#14B8A6',
          foreground: '#FFFFFF'
        },
        destructive: {
          DEFAULT: '#FF2A2A',
          foreground: '#FFFFFF'
        },
        border: '#E5E5E5',
        input: '#E5E5E5',
        ring: '#06B6D4'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};
