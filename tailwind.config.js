module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      nunito: ["nunito", "sans-serif"]
    },
    extend: {
      transitionProperty: {
        'max-height': 'max-height',
        'max-width': 'max-width'
      }
    },
  },
  plugins: [],
}
