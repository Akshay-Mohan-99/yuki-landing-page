/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        pop: {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(-50px)" },
        },
      },
      fontFamily: {
        sans: ["Gilroy-EB", "Poppins", "sans-serif"],
        gilroy: ["Gilroy-M", "Poppins", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        pop: "pop 0.6s ease-out forwards",
      },
      colors: {
        violetBrand: "#7523FD",
        purpleBrand: "#FF00C2",
        goldBrand: "#FFE60F",
        transparent: "transparent",
      },
    },
  },
  plugins: [],
};
