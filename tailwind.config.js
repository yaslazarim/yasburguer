/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",        // Arquivos HTML na raiz
    "./*.js",          // Arquivos JS na raiz
  ],
  theme: {
    fontFamily:{'sans': ['Poppins', 'sans-serif'] },
    extend: {
      backgroundImage: {
        "home": "url('/assets/bg.png')"
      }
    },
  },
  plugins: [],
}