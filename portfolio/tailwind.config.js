/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./*.html",
        "./*.js"
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Inter"', 'system-ui', 'sans-serif'],
                display: ['"Space Grotesk"', 'sans-serif'],
                serif: ['"Noto Serif TC"', 'serif'],
                mono: ['"JetBrains Mono"', 'monospace'],
            },
            colors: {
                dark: '#050505',
                'card-bg': '#0a0a0a',
                gold: '#F59E0B',
                orange: '#EA580C',
                cyan: '#00F0FF',
                vermilion: '#CD2626',
            },
            animation: {
                'spin-slow': 'spin 30s linear infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-15px)' },
                },
            },
        }
    },
    plugins: [],
}
