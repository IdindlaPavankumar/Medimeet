/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            color: {
                ' primary': '#5f6FFF'
            }
        },
    },
    plugins: [],
}
