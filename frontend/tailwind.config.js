/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#FF6B9D', light: '#FF9BC0', dark: '#E84D80' },
        secondary: { DEFAULT: '#FFD93D', light: '#FFE574', dark: '#F0C420' },
        accent: { DEFAULT: '#6C5CE7', light: '#A29BFE', dark: '#5541D9' },
        dark: { DEFAULT: '#1A1A2E', light: '#16213E', lighter: '#0F3460' },
        light: { DEFAULT: '#FFF8F0', warm: '#FFF0E0', cool: '#F8F9FA' },
        success: '#00D2A0',
        warning: '#FFA502',
        danger: '#FF4757',
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'marquee': 'marquee 25s linear infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0,0,0,0.06)',
        'card-hover': '0 12px 40px rgba(0,0,0,0.12)',
        'glow-pink': '0 0 30px rgba(255,107,157,0.3)',
        'glow-purple': '0 0 30px rgba(108,92,231,0.3)',
      },
    },
  },
  plugins: [],
};
