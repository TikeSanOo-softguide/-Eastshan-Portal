import { cx } from '@/lib/cx';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

/** Display order; Myanmar is default and first in the cycle. */
const LOCALE_ORDER = ['my', 'en', 'zh'];

const META = {
    my: {
        labelKey: 'common.language.my',
        short: 'MY',
    },
    en: {
        labelKey: 'common.language.en',
        short: 'EN',
    },
    zh: {
        labelKey: 'common.language.zh',
        short: '中文',
    },
};

function currentBarePath() {
    const url = new URL(window.location.href);
    const bare = url.pathname.replace(/^\/(en|my|zh)(?=\/|$)/, '') || '/';
    const path = bare.startsWith('/') ? bare : `/${bare}`;

    return `${path}${url.search}`;
}

function nextLocale(current, locales) {
    const order = LOCALE_ORDER.filter((code) => locales.includes(code));
    const list = order.length > 0 ? order : locales;
    const index = list.indexOf(current);
    const from = index >= 0 ? index : 0;

    return list[(from + 1) % list.length];
}

export default function LanguageSwitcher({ tone = 'default', mode = 'public' }) {
    const { t } = useTranslation();
    const { locale, locales = LOCALE_ORDER } = usePage().props;
    const [pending, setPending] = useState(false);

    const current = META[locale] ?? META.my;
    const upcoming = nextLocale(locale, locales);
    const upcomingMeta = META[upcoming] ?? META.en;
    const onNavy = tone === 'inverse';

    const cycle = () => {
        if (pending || !upcoming || upcoming === locale) {
            return;
        }

        setPending(true);

        if (mode === 'admin') {
            router.post(
                '/mongla/admin/locale',
                { locale: upcoming },
                {
                    preserveScroll: true,
                    onFinish: () => setPending(false),
                },
            );

            return;
        }

        const to = currentBarePath();
        router.visit(`/locale/${upcoming}?to=${encodeURIComponent(to)}`, {
            preserveScroll: true,
            onFinish: () => setPending(false),
        });
    };

    return (
        <button
            type="button"
            className={cx(
                'inline-flex h-8 items-center justify-center rounded-[6px] border px-2.5 text-xs font-medium',
                'transition-colors duration-200',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                onNavy
                    ? 'border-white/25 bg-white/10 text-white hover:bg-white/20'
                    : 'border-border bg-surface text-text hover:bg-text/5',
                pending && 'pointer-events-none opacity-70',
            )}
            aria-label={`${t('common.language.label')}: ${t(current.labelKey)}. ${t('common.language.next', { lang: t(upcomingMeta.labelKey) })}`}
            title={`${t(current.labelKey)} → ${t(upcomingMeta.labelKey)}`}
            disabled={pending}
            onClick={cycle}
        >
            <span className="leading-none tracking-wide">{current.short}</span>
        </button>
    );
}
