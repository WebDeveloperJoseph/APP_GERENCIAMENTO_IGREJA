/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#eff6ff",
          100: "#dbeafe",
          700: "#0d47a1",
          800: "#083b87",
          900: "#06295f",
          950: "#041b3f"
        },
        teal: {
          500: "#0ea5a6",
          600: "#078b8c"
        }
      },
      boxShadow: {
        soft: "0 16px 50px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};
