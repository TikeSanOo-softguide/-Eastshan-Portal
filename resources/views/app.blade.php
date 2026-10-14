<!DOCTYPE html>
<html lang="{{ app()->getLocale() === 'zh' ? 'zh-Hans' : str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <script>
            (() => {
                const admin = /^\/mongla\/admin(?:\/|$)/.test(location.pathname);
                if (!admin) {
                    document.documentElement.classList.add('light');
                    document.documentElement.dataset.theme = 'light';
                    return;
                }

                try {
                    const preference = localStorage.getItem('eastshan-theme');
                    const theme = preference === 'light' || preference === 'dark'
                        ? preference
                        : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                    document.documentElement.classList.add(theme);
                    document.documentElement.dataset.theme = preference || 'system';
                } catch (_) {
                    document.documentElement.classList.add(
                        matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
                    );
                }
            })();
        </script>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700|playfair-display:500,600,700|noto-sans-myanmar:400,500,700|noto-sans-sc:400,500,700&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="bg-bg font-sans text-text antialiased">
        @inertia
    </body>
</html>
