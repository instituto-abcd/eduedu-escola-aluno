const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: "360px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    extend: {
      fontFamily: {
        sans: ["Nunito Sans Variable", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        background: "#FFF",
        surface: "#F8F6F2",
        text: "#4D4941",
      },
      boxShadow: {
        card: "0px 8px 0px 0px #4c494166",
        "card-thin": "0px 2px 0px 0px #4c494166",
        "card-medium": "0px 5px 0px 0px #4c494166",
      },
    },
  },
  plugins: [],
};
