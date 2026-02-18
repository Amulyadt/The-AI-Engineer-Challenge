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
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
      colors: {
        sage: {
          50: "#f6f7f4",
          100: "#e8ebe3",
          200: "#d3d9c8",
          300: "#b4bfa3",
          400: "#94a07d",
          500: "#788662",
          600: "#5e6b4c",
          700: "#4b553d",
          800: "#3e4634",
          900: "#353c2d",
        },
      },
    },
  },
  plugins: [],
};

export default config;
