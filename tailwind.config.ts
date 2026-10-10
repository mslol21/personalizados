import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#FAF8F5",
          surface: "#FFFFFF",
          card: "#FDFCF9",
          muted: "#F3EEE8",
          border: "#EAE3DA",
          gold: {
            50: "#FCF9F2",
            100: "#F7F0DF",
            200: "#EEDDB6",
            300: "#E2C78A",
            400: "#D4AF37",
            500: "#C59E3F",
            600: "#A6802C",
            700: "#87661E",
            800: "#694F14",
            900: "#4D390A",
          },
          graphite: {
            50: "#F8F9FA",
            100: "#EDEFF2",
            200: "#DDE1E6",
            300: "#B8C0CC",
            400: "#8A94A6",
            600: "#525B6A",
            700: "#3D4450",
            800: "#272C35",
            900: "#16191E",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-cormorant)", "Georgia", "serif"],
      },
      boxShadow: {
        subtle: "0 2px 10px rgba(26, 29, 32, 0.04), 0 1px 3px rgba(26, 29, 32, 0.02)",
        card: "0 4px 20px -2px rgba(45, 49, 57, 0.06), 0 2px 6px -1px rgba(45, 49, 57, 0.03)",
        cardHover: "0 12px 30px -4px rgba(166, 128, 44, 0.12), 0 4px 12px -2px rgba(45, 49, 57, 0.04)",
        goldGlow: "0 0 25px rgba(197, 158, 63, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
