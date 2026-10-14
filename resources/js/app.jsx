import '../css/app.css';
import './bootstrap';
import './lib/i18n';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import i18n, { applyLocale } from './lib/i18n';
import { applyThemeClass } from './lib/theme';

applyThemeClass();

router.on('success', (event) => {
    applyLocale(event.detail.page.props.locale);
    applyThemeClass(undefined, event.detail.page.url);
});

createInertiaApp({
    title: (title) => `${title} - ${i18n.t('common.appName')}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        applyLocale(props.initialPage.props.locale);

        const root = createRoot(el);

        root.render(
            <I18nextProvider i18n={i18n}>
                <App {...props} />
            </I18nextProvider>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});
