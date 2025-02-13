module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'celadon': '#B7e3cc',
        'slategray':'#33595C', 
        'licorice': '#24191E',
        'pearl': '#F5ECE0',
        'isabelline':'#FAF5F0',
        'yellow': '#FFD700',
        'red': '#FF0000',
        'green': '#00FF00',
        'milk': '#F9F7FO',
        'lightstone': '#DBD2C2',
        'desertclay': '#B17457',
        'graphite': '#4A4947'
      },
      fontFamily: {
        'helvetica-regular': ['Helvetica-Regular', 'sans-serif'],
        'helvetica-light': ['Helvetica Light-Regular', 'sans-serif'],
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
}