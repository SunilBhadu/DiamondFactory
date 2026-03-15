import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
    extend: {
      colors: {
        gold: {
          50: '#fdfaf0',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#d4af37',
          600: '#b8960c',
          700: '#92740a',
          800: '#78590a',
          900: '#5c420a',
        },
        diamond: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        charcoal: {
          50: '#f8f8f8',
          100: '#f0f0f0',
          200: '#e4e4e4',
          300: '#d1d1d1',
          400: '#a0a0a0',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        float: 'float 6s ease-in-out infinite',
        sparkle: 'sparkle 1.5s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.2)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        luxury: '0 4px 40px rgba(212, 175, 55, 0.15)',
        'luxury-lg': '0 8px 60px rgba(212, 175, 55, 0.25)',
        'luxury-hover': '0 20px 80px rgba(212, 175, 55, 0.35)',
        card: '0 2px 20px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 10px 40px rgba(0, 0, 0, 0.15)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #d4af37 0%, #f5d77e 50%, #b8960c 100%)',
        'dark-gradient': 'linear-gradient(135deg, #171717 0%, #262626 100%)',
        'hero-gradient': 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)',
        shimmer:
          'linear-gradient(90deg, transparent 0%, rgba(212, 175, 55, 0.3) 50%, transparent 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
