// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./public/*.html"
//   ],
//   theme: {
//     extend: {
//       colors: {
//         'primary': '#34aae2',
//         'secondary': '#7084a1'
//       },
//     },
//   },
//   plugins: [],
// }

// tailwind.config.js
module.exports = {
  content: [
    "./public/*.html"
  ],
  purge: ['./public/**/*.html', './src/**/*.js'],
  theme: {
    extend: {
      colors: {
        'primary': '#34aae2',
        'secondary': '#7084a1'
      },
    },
  },
  plugins: [],
}
