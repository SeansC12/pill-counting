/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "pulse-gradient":
          "pulse-gradient 2s ease-in-out infinite",
      },
      // keyframes: {
      //   "pulse-gradient": {
      //     "0%, 100%": { backgroundPosition: "0% 50%" },
      //     "50%": { backgroundPosition: "100% 50%" },
      //   },
      // },
      colors: {
        destructive: "#D22B2B",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
