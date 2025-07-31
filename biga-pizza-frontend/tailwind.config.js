module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      // transitionProperty: {
      // 'colors': 'background-color, border-color, color, fill, stroke',
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
