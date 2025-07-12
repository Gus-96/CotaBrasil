module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          100: '#1E293B', // Cor de fundo dos cards
          200: '#0F172A', // Cor de fundo da tela
        }
      }
    },
  },
  plugins: [],
}