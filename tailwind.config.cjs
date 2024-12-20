module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      patterns: {

        sizes: {
          1: "0.25rem",
          2: "0.5rem",
          4: "1rem",
          8: "2rem",
          16: "4rem",
          32: "8rem",
          64: "16rem",
        },
        opacities: {
          10: "0.1",
          20: "0.2",
          40: "0.4",
          60: "0.6",
          80: "0.8",
          100: "1.0",
        },
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-bg-patterns")],
};
