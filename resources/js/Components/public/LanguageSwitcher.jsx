import { router, usePage } from '@inertiajs/react';
import { useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cx } from '@/lib/cx';

const labelKey = {
    en: 'common.language.en',
    my: 'common.language.my',
    zh: 'common.language.zh',
};

export default function LanguageSwitcher({ tone = 'default', mode = 'public' }) {
    const { t } = useTranslation();
    const { locale, locales = [] } = usePage().props;
    const [open, setOpen] = useState(false);
    const rootRef = useRef(null);
    const listId = useId();

    useEffect(() => {
        if (!open) {
            return undefined;
        }

        const onPointerDown = (event) => {
            if (!rootRef.current?.contains(event.target)) {
                setOpen(false);
            }
        };

        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };

        document.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [open]);

    const visit = (code) => {
        if (mode === 'admin') {
            setOpen(false);
            router.post('/mongla/admin/locale', { locale: code }, { preserveScroll: true });

            return;
        }

        const url = new URL(window.location.href);
        const nextPath = url.pathname.replace(
            /^\/(en|my|zh)(?=\/|$)/,
            `/${code}`,
        );
        const path = nextPath.startsWith(`/${code}`) ? nextPath : `/${code}`;

        setOpen(false);
        router.visit(`${path}${url.search}`);
    };

    const onNavy = tone === 'inverse';

    return (
        <div ref={rootRef} className="relative">
            <button
                type="button"
                className={cx(
                    'inline-flex min-h-11 min-w-11 items-center gap-2 rounded-md px-3 text-sm font-medium',
                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                    onNavy
                        ? 'text-white hover:bg-white/10'
                        : 'text-text hover:bg-text/5',
                )}
                aria-label={t('common.language.label')}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={listId}
                onClick={() => setOpen((current) => !current)}
            >
                {t(labelKey[locale] ?? labelKey.my)}
            </button>

            {open ? (
                <ul
                    id={listId}
                    role="listbox"
                    aria-label={t('common.language.label')}
                    className="absolute end-0 z-50 mt-2 min-w-44 rounded-md border border-border bg-surface py-1 text-text shadow-sm"
                >
                    {locales.map((code) => (
                        <li key={code} role="presentation">
                            <button
                                type="button"
                                role="option"
                                aria-selected={code === locale}
                                className={cx(
                                    'flex min-h-11 w-full items-center px-4 text-start text-sm',
                                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                                    code === locale
                                        ? 'text-text'
                                        : 'text-muted hover:bg-text/5 hover:text-text',
                                )}
                                onClick={() => visit(code)}
                            >
                                {t(labelKey[code] ?? code)}
                            </button>
                        </li>
                    ))}
                </ul>
            ) : null}
        </div>
    );
}
