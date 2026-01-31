/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#6dec13',
                backgroundLight: '#f7f8f6',
                backgroundDark: '#182210',
                textDark: '#141811',
                textSecondary: '#728961',
                border: '#e2e4e0'
            },
        },
    },
    plugins: [],
}
