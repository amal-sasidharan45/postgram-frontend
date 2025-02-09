/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}", // Adjust this based on your file structure
  ],
  theme: {
    extend: {
      colors:{
        customColor:'#006990'
      }
    },
  },
  plugins: [],
};
