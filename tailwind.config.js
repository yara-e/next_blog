/** @type {import('tailwindcss').Config} */
export default {
    content: [

        "./components/**/*.{js,ts,jsx,tsx}",
        "./app/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-poppins)"],
            },
        },
    },
    plugins: [],
}
