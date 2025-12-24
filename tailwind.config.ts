import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Syntropedia Teal Palette (from logo gradient end) - Primary for buttons/tags
        primary: {
          50: '#E8F8F5',
          100: '#D0F0EA',
          200: '#A0E0D5',
          300: '#70D0C0',
          400: '#4DB6AC',
          500: '#3DA89E',
          600: '#308880',
          700: '#256860',
          800: '#1A4840',
          900: '#102820',
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // Syntropedia Orange/Amber Palette (from logo gradient start)
        syntropy: {
          50: '#FFF8ED',
          100: '#FFEDCC',
          200: '#FFDB99',
          300: '#FFC966',
          400: '#F0A830',
          500: '#E89830',
          600: '#D08020',
          700: '#A86818',
          800: '#805010',
          900: '#583808',
        },
        // shadcn/ui colors using CSS variables
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        'sm': '8px',
        'DEFAULT': '12px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
      },
      boxShadow: {
        'soft': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'lifted': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)',
      },
      maxWidth: {
        'container': '1280px',
      },
      spacing: {
        '18': '72px',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
