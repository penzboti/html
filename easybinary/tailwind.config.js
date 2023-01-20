/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
}

// Start a watcher
// ./tailwindcss -i input.css -o ./public/style.css --watch

// Compile and minify your CSS for production
// ./tailwindcss -i input.css -o ./public/style.css --minify