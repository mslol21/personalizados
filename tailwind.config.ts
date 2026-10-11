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
          bg: "#F8F7F7",
          surface: "#FFFFFF",
          card: "#FCFAFB",
          muted: "#F4F1F3",
          border: "#E7E1E5",
          accent: { pink: "#F5005F", lime: "#F8FF77", cyan: "#42C1E8" },
          primary: {
            50: "#FFF1F6",
            100: "#FFE1EC",
            200: "#FFC2D8",
            300: "#FF91B9",
            400: "#FF4D91",
            500: "#E00056",
            600: "#C20048",
            700: "#A3003E",
            800: "#840636",
            900: "#680A2D",
          },
          graphite: {
            50: "#FAF9FA",
            100: "#F0EDF0",
            200: "#E2DDE2",
            300: "#C8C0C8",
            400: "#A89CA7",
            600: "#625864",
            700: "#49404D",
            800: "#2D2430",
            900: "#1A1A1A",
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
        cardHover: "0 12px 30px -4px rgba(194, 0, 72, 0.12), 0 4px 12px -2px rgba(45, 49, 57, 0.04)",
        primaryGlow: "0 0 25px rgba(245, 0, 95, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
