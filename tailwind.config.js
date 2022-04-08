const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./doc-src/**/*.{html,js,css,tsx}"],
  theme: {
    extend: {
      colors
    }
  },
  plugins: []
};
