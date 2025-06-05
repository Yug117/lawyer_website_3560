module.exports = {
  content: ["./pages/*.{html,js}", "./index.html"],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: "#1e1b4b", // indigo-950
        "primary-light": "#312e81", // indigo-900
        accent: "#f59e0b", // amber-500
        "accent-dark": "#d97706", // amber-600
        secondary: "#991b1b", // red-800
        "secondary-light": "#b91c1c", // red-700
        
        // Neutral Colors
        "off-white": "#f9fafb", // gray-50
        "light-gray": "#e5e7eb", // gray-200
        "medium-gray": "#9ca3af", // gray-400
        "dark-gray": "#374151", // gray-700
        charcoal: "#1f2937", // gray-800
        
        // Semantic Colors
        success: "#059669", // green-600
        warning: "#eab308", // yellow-500
        error: "#dc2626", // red-600
        info: "#2563eb", // blue-600
      },
      fontFamily: {
        serif: ['Merriweather', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'hero': ['3rem', { lineHeight: '1.2' }],
        'heading-1': ['2.25rem', { lineHeight: '1.2' }],
        'heading-2': ['1.875rem', { lineHeight: '1.2' }],
        'heading-3': ['1.5rem', { lineHeight: '1.2' }],
        'subtitle': ['1.25rem', { lineHeight: '1.4' }],
        'body-large': ['1.125rem', { lineHeight: '1.6' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'body-small': ['0.875rem', { lineHeight: '1.6' }],
        'caption': ['0.75rem', { lineHeight: '1.4' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'strong': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 2px 10px -2px rgba(0, 0, 0, 0.05)',
      },
      backdropBlur: {
        xs: '2px',
      },
      scale: {
        '102': '1.02',
        '98': '0.98',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}