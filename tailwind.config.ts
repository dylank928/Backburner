import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAFAF9',
        surface: '#FFFFFF',
        surfaceSoft: '#FFF7ED',
        
        textPrimary: '#18181B',
        textSecondary: '#71717A',

        accent: {
          warm: '#FB923C',
          hot: '#EF4444',
          soft: '#FDE68A',
          cool: '#A78BFA',
        }
    
      },

      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        pill: '9999px',
      },

      boxShadow: {
        soft: '0 4px 12px rgba(0,0,0,0.05)',
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: []
};
export default config;
