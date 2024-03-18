/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        brown: {
          50: 'rgb(243, 233, 224)',
          100: 'rgb(237, 222, 211)',
          200: 'rgb(222, 202, 186)',
          300: 'rgb(207, 182, 161)',
          400: 'rgb(191, 162, 137)',
          500: 'rgb(176, 141, 113)',
          600: 'rgb(161, 120, 89)',
          700: 'rgb(145, 100, 66)',
          800: 'rgb(130, 80, 44)',
          900: 'rgb(115, 60, 23)',
          950: 'rgb(97, 50, 15)',
        },
      },
    },
  },
  plugins: [
    function({ addVariant, e }) {
      addVariant('old', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.old .${e(`old${separator}${className}`)}`;
        });
      });
    },
  ],
}
