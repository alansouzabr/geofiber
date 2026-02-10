/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#eefcff",
          100: "#d7f6ff",
          200: "#b1eeff",
          300: "#7ee3ff",
          400: "#3fd0ff",
          500: "#12b3ff",   // azul “fibra”
          600: "#0b8fd6",
          700: "#0b6fa8",
          800: "#0b577f",
          900: "#0a4664"
        },
        fiber: {
          500: "#16c784",   // verde “sinal”
          600: "#12a86d"
        },
        surface: {
          50:  "#f7fbff",
          100: "#eef5ff",
          200: "#dbe9ff",
          800: "#0b1b35",
          900: "#071226"
        }
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(2, 20, 60, 0.08)"
      }
    },
  },
  plugins: [],
};
