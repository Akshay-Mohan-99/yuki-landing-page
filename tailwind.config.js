/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Gilroy-EB", "Poppins", "sans-serif"],
        gilroy: ["Gilroy-M", "Poppins", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      colors: {
        violetBrand: "#7523FD",
        purpleBrand: "#FF00C2",
        transparent: 'transparent',
      },
    },
  },
  plugins: [],
};
