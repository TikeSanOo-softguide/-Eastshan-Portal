import { cx } from '@/lib/cx';
import { formatDate } from '@/lib/formatDate';
import { useTranslation } from 'react-i18next';

export default function NewsDigestItem({ item, locale }) {
    const { t } = useTranslation();

    return (
        <article className="border-b border-border py-6 last:border-b-0">
            <header className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-[0.14em] text-muted">
                {item.published_at ? (
                    <time dateTime={item.published_at}>
                        {formatDate(item.published_at, locale)}
                    </time>
                ) : null}
                {item.category?.name ? (
                    <span>{item.category.name}</span>
                ) : null}
            </header>
            <h2 className="mt-3 font-display text-2xl text-text">{item.title}</h2>
            {item.excerpt ? (
                <p className="mt-3 max-w-prose text-base leading-7 text-muted [html[lang=my]_&]:leading-[1.8]">
                    {item.excerpt}
                </p>
            ) : null}
            {(item.source_name || item.source_url) && (
                <p className="mt-4 text-sm text-text">
                    <span className="text-muted">{t('news.source')}: </span>
                    {item.source_url ? (
                        <a
                            href={item.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cx(
                                'font-medium underline decoration-accent underline-offset-4',
                                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                            )}
                        >
                            {item.source_name || item.source_url}
                        </a>
                    ) : (
                        <span className="font-medium">{item.source_name}</span>
                    )}
                </p>
            )}
        </article>
    );
}
