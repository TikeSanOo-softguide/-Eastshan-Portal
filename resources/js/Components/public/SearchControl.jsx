import { cx } from '@/lib/cx';
import { localizedHref, searchHref } from '@/lib/navigation';
import { router, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function SearchControl({ tone = 'inverse' }) {
    const { t } = useTranslation();
    const locale = usePage().props.locale ?? 'my';
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const rootRef = useRef(null);
    const inputRef = useRef(null);
    const wasOpen = useRef(false);
    const formId = useId();
    const inputId = useId();

    useEffect(() => {
        if (!open) {
            return undefined;
        }

        inputRef.current?.focus();

        const onPointerDown = (event) => {
            if (!rootRef.current?.contains(event.target)) {
                setOpen(false);
            }
        };

        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
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

    useEffect(() => {
        if (wasOpen.current && !open) {
            rootRef.current?.querySelector('button')?.focus();
        }

        wasOpen.current = open;
    }, [open]);

    const onSubmit = (event) => {
        event.preventDefault();
        setOpen(false);
        router.get(
            localizedHref(locale, searchHref),
            { q: query },
            { preserveScroll: true },
        );
    };

    return (
        <div ref={rootRef} className="relative">
            <button
                type="button"
                className={cx(
                    'inline-flex min-h-11 items-center gap-2 rounded-md px-2 text-xs font-medium uppercase tracking-[0.16em]',
                    tone === 'inverse'
                        ? 'text-white hover:bg-white/10'
                        : 'text-text hover:bg-text/5',
                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                )}
                aria-label={t('nav.search')}
                aria-expanded={open}
                aria-controls={open ? formId : undefined}
                onClick={() => setOpen((current) => !current)}
            >
                <span className="hidden sm:inline">{t('nav.search')}</span>
                <Search className="size-5" aria-hidden="true" />
            </button>

            {open ? (
                <form
                    id={formId}
                    role="search"
                    onSubmit={onSubmit}
                    className="absolute end-0 top-full z-50 mt-2 w-[min(20rem,calc(100vw-2rem))] border border-border bg-surface p-3 text-text shadow-md"
                >
                    <label
                        htmlFor={inputId}
                        className="mb-2 block text-sm font-medium"
                    >
                        {t('nav.searchLabel')}
                    </label>
                    <input
                        ref={inputRef}
                        id={inputId}
                        name="q"
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        className="block min-h-11 w-full border-border bg-surface text-sm text-text focus:border-accent focus:ring-accent"
                    />
                    <button
                        type="submit"
                        className={cx(
                            'mt-3 inline-flex min-h-11 items-center bg-primary px-4 text-sm font-medium text-on-primary',
                            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                        )}
                    >
                        {t('nav.searchSubmit')}
                    </button>
                </form>
            ) : null}
        </div>
    );
}
