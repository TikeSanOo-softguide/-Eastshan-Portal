import { cx } from '@/lib/cx';
import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Breadcrumb({ items = [] }) {
    const { t } = useTranslation();

    if (!items.length) {
        return null;
    }

    return (
        <nav aria-label={t('common.breadcrumb')} className="mb-4">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-muted">
                {items.map((item, index) => {
                    const last = index === items.length - 1;

                    return (
                        <li key={`${item.label}-${index}`} className="inline-flex items-center gap-1">
                            {index > 0 ? (
                                <ChevronRight
                                    className="size-3.5 shrink-0 opacity-60"
                                    aria-hidden="true"
                                />
                            ) : null}
                            {last || !item.href ? (
                                <span
                                    className={cx(
                                        'inline-flex items-center py-1',
                                        last && 'text-text',
                                    )}
                                    aria-current={last ? 'page' : undefined}
                                >
                                    {item.label}
                                </span>
                            ) : (
                                <Link
                                    href={item.href}
                                    className="inline-flex items-center py-1 hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                                >
                                    {item.label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
