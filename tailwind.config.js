module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {      // Lunar Shadow Color Palette
      colors: {
        'lunar': {
          'deep': '#111316',        // Primary Background (Deep Space)
          'dark': '#24292e',        // Primary Surface/Container Background
          'medium': '#3d444c',      // Secondary Container Background
          'gray': '#3d444c',        // Secondary Container Background (alias)
          'light': '#c8d1d9',       // Standard Body Text
          'muted': '#8b949e',       // Muted text color
          'accent': '#f0f6fc',      // Primary Accent (Headings, Icons, Active States)
          'accent-text': '#111316', // Accent Text (on solid accent backgrounds)
        }
      },
      fontFamily: {
        'space-grotesk': ['"Space Grotesk"', 'sans-serif'],
        'lato': ['Lato', 'sans-serif'],
        'orbitron': ['Orbitron', 'sans-serif'],
        'exo-2': ['"Exo 2"', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'moon-rock': 'url("https://www.transparenttextures.com/patterns/rocky-wall.png")',
      },      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'twinkle': 'twinkle 4s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'cosmic-pulse': 'cosmic-pulse 5s infinite ease-in-out',
        'cosmic-float': 'cosmic-float 8s infinite ease-in-out',
        'gradient-shift': 'gradient-shift 3s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
        glow: {
          '0%': { 
            textShadow: '0 0 10px rgba(240, 246, 252, 0.3), 0 0 20px rgba(240, 246, 252, 0.2)' 
          },
          '100%': { 
            textShadow: '0 0 20px rgba(240, 246, 252, 0.4), 0 0 30px rgba(240, 246, 252, 0.3)' 
          },
        },        'cosmic-pulse': {
          '0%': {
            transform: 'scale(1)',
            boxShadow: '0 0 10px rgba(240, 246, 252, 0.7)',
          },
          '50%': {
            transform: 'scale(1.05)',
            boxShadow: '0 0 25px rgba(240, 246, 252, 0.9)',
          },
          '100%': {
            transform: 'scale(1)',
            boxShadow: '0 0 10px rgba(240, 246, 252, 0.7)',
          },
        },
        'cosmic-float': {
          '0%': {
            transform: 'translateY(0px) translateX(0px)',
          },
          '50%': {
            transform: 'translateY(-15px) translateX(10px)',
          },
          '100%': {
            transform: 'translateY(0px) translateX(0px)',
          },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },        'fadeInUp': {
          'from': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      borderRadius: {
        'xl': '0.75rem',
      },
      boxShadow: {
        'lunar-hover': '0 4px 20px rgba(240, 246, 252, 0.1)',
        'lunar-glow': '0 0 20px rgba(240, 246, 252, 0.3)',
      },      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // Add lunar color utilities
    function({ addUtilities, theme }) {
      const lunarColors = theme('colors.lunar');
      const utilities = {};
      
      // Generate text utilities
      Object.keys(lunarColors).forEach(key => {
        utilities[`.text-lunar-${key}`] = {
          color: lunarColors[key]
        };
      });
      
      // Generate background utilities  
      Object.keys(lunarColors).forEach(key => {
        utilities[`.bg-lunar-${key}`] = {
          backgroundColor: lunarColors[key]
        };
      });
      
      // Generate border utilities
      Object.keys(lunarColors).forEach(key => {
        utilities[`.border-lunar-${key}`] = {
          borderColor: lunarColors[key]
        };
      });
      
      addUtilities(utilities);
    }
  ],
}
