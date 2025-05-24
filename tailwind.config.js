/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FFD600",
        accent: "#F59E0B",
        background: "#000000",
        foreground: "#FFFFFF",
        danger: "#EF4444",
        bluish: "#1E40AF",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        lg: "12px",
      },
    },
  },
  plugins: [],
};
