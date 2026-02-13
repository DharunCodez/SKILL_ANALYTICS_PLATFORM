/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                dark: {
                    900: '#0F172A', // Slate 900
                    800: '#1E293B', // Slate 800
                    700: '#334155', // Slate 700
                },
                primary: {
                    DEFAULT: '#06B6D4', // Cyan 500
                    hover: '#0891B2',   // Cyan 600
                },
                secondary: {
                    DEFAULT: '#8B5CF6', // Violet 500
                    hover: '#7C3AED',   // Violet 600
                },
                accent: {
                    DEFAULT: '#10B981', // Emerald 500
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            boxShadow: {
                'neon-blue': '0 0 10px rgba(6, 182, 212, 0.5)',
                'neon-purple': '0 0 10px rgba(139, 92, 246, 0.5)',
            }
        },
    },
    plugins: [],
}
