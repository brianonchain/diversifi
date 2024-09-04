import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        blue1: "#050929",
        blue2: "#0F226B",
        blue3: "#2C247D",
        blue4: "#0364FF",
        card1: "#251E51",
        text2: "#94A3B8",
        button1: "#0364FF",
      },
    },
    screens: {
      xs: "480px",
      sm: "600px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    // backgroundImage: {
    //   "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
    // },
  },
  plugins: [],
};
export default config;
