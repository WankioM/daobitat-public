module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        'gradient-x': 'gradient-x 10s ease infinite',
      },
      colors: {
        'celadon': '#d43545',
        'slategray':'#33595C', 
        'licorice': '#24191E',
        'pearl': '#F5ECE0',
        'isabelline':'#FAF5F0',
        'yellow': '#FFD700',
        'red': '#FF0000',
        'desertclay': '#B17457',
        'green': '#00FF00',
        'seagreen':'#4C956C',
        'milk': '#F9F7F0',
        'lightstone': '#DBD2C2',
        'graphite': '#4A4947',
        'rustyred': '#d43545',
        
      },
      fontFamily: {
        'helvetica-regular': ['Helvetica-Regular', 'sans-serif'],
        'helvetica-light': ['Helvetica Light-Regular', 'sans-serif'],
        'florsoutline': ['florsoutline', 'sans-serif'], 
      'florssolid':['florssolid','sans-serif']  
       },
       keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-position': '0% 0%',
          },
          '50%': {
            'background-position': '100% 0%',
          },
        },
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
}