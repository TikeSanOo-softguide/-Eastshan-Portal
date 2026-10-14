import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../locales/en.json';
import my from '../locales/my.json';
import zh from '../locales/zh.json';

export function documentLang(locale) {
    if (locale === 'zh') {
        return 'zh-Hans';
    }

    return locale || 'my';
}

export function applyLocale(locale) {
    if (!locale) {
        return;
    }

    if (i18n.language !== locale) {
        i18n.changeLanguage(locale);
    }

    const lang = documentLang(locale);

    if (typeof document !== 'undefined' && document.documentElement.lang !== lang) {
        document.documentElement.lang = lang;
    }
}

function initialLocale() {
    if (typeof document === 'undefined') {
        return 'my';
    }

    const lang = document.documentElement.lang || 'my';

    if (lang.startsWith('zh')) {
        return 'zh';
    }

    if (lang === 'en' || lang === 'my') {
        return lang;
    }

    return 'my';
}

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        my: { translation: my },
        zh: { translation: zh },
    },
    lng: initialLocale(),
    fallbackLng: ['my', 'en'],
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
