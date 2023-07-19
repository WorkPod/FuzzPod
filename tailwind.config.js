/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        octosquare: ["octosquare", "Noto Sans"],
        yoster: ["yoster", "Noto Sans"],
        notosans: ["Noto Sans"],
      },
    },
  },
  plugins: [],
};
