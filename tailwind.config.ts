import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', "system-ui", "sans-serif"],
        display: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
      },
      colors: {
        // Fintech palette - dark, premium
        background: "hsl(0 0% 100%)",
        foreground: "hsl(222 47% 11%)",
        muted: {
          DEFAULT: "hsl(210 40% 96%)",
          foreground: "hsl(215 16% 47%)",
        },
        border: "hsl(214 32% 91%)",
        // Status colors
        success: {
          DEFAULT: "hsl(142 71% 45%)",
          bg: "hsl(143 85% 96%)",
          fg: "hsl(140 85% 25%)",
        },
        warning: {
          DEFAULT: "hsl(38 92% 50%)",
          bg: "hsl(48 96% 95%)",
          fg: "hsl(28 80% 35%)",
        },
        danger: {
          DEFAULT: "hsl(0 84% 60%)",
          bg: "hsl(0 86% 97%)",
          fg: "hsl(0 74% 42%)",
        },
        brand: {
          DEFAULT: "hsl(221 83% 53%)",
          dark: "hsl(224 76% 33%)",
        },
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.125rem",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
