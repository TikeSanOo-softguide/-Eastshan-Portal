import { cx } from '@/lib/cx';
import { Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Pagination({ meta, links, className = '' }) {
    const { t } = useTranslation();

    if (!meta || meta.last_page <= 1) {
        return null;
    }

    const go = (url) => {
        if (!url) {
            return;
        }

        router.visit(url, { preserveScroll: true, preserveState: true });
    };

    return (
        <nav
            aria-label={t('common.pagination')}
            className={cx(
                'mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6',
                className,
            )}
        >
            <p className="text-sm text-muted">
                {t('common.paginationStatus', {
                    from: meta.from ?? 0,
                    to: meta.to ?? 0,
                    total: meta.total,
                })}
            </p>
            <div className="flex gap-2">
                <button
                    type="button"
                    className={cx(
                        'inline-flex min-h-11 items-center border border-border px-4 text-sm',
                        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                        !links?.prev && 'pointer-events-none opacity-40',
                    )}
                    disabled={!links?.prev}
                    onClick={() => go(links.prev)}
                >
                    {t('common.previous')}
                </button>
                <button
                    type="button"
                    className={cx(
                        'inline-flex min-h-11 items-center border border-border px-4 text-sm',
                        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                        !links?.next && 'pointer-events-none opacity-40',
                    )}
                    disabled={!links?.next}
                    onClick={() => go(links.next)}
                >
                    {t('common.next')}
                </button>
            </div>
            {links?.first ? (
                <Link href={links.first} className="sr-only">
                    {t('common.firstPage')}
                </Link>
            ) : null}
        </nav>
    );
}
