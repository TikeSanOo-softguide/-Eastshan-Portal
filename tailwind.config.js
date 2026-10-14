import forms from '@tailwindcss/forms';

/** @param {string} variable */
function token(variable) {
    return `rgb(var(${variable}) / <alpha-value>)`;
}

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',

    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.js',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            colors: {
                navy: {
                    DEFAULT: '#0a1433',
                    50: '#f4f6fb',
                    100: '#e6eaf3',
                    200: '#c8d1e4',
                    300: '#a3b1ce',
                    400: '#7688ae',
                    500: '#52648e',
                    600: '#3b4c72',
                    700: '#283656',
                    800: '#16233f',
                    900: '#0a1433',
                    950: '#070c1c',
                },
                gold: {
                    DEFAULT: '#b8975a',
                    50: '#fbf8f2',
                    100: '#f4ead6',
                    200: '#e7d4ad',
                    300: '#d4b87d',
                    400: '#c4a56c',
                    500: '#b8975a',
                    600: '#9c7d45',
                    700: '#7d6437',
                    800: '#5f4c2b',
                    900: '#40331d',
                },
                bg: token('--bg'),
                surface: token('--surface'),
                text: token('--text'),
                muted: token('--muted'),
                border: token('--border'),
                primary: token('--primary'),
                'on-primary': token('--on-primary'),
                accent: token('--accent'),
            },
            fontFamily: {
                sans: 'var(--font-sans)',
                display: 'var(--font-display)',
                myanmar: 'var(--font-myanmar)',
                sc: 'var(--font-sc)',
            },
            maxWidth: {
                content: '1200px',
            },
        },
    },

    plugins: [forms],
};
