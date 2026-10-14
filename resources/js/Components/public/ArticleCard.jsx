import { cx } from '@/lib/cx';
import { formatDate } from '@/lib/formatDate';
import { localizedHref } from '@/lib/navigation';
import { Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function ArticleCard({ article }) {
    const { t } = useTranslation();
    const locale = usePage().props.locale ?? 'my';

    return (
        <article className="flex h-full flex-col border border-border bg-surface">
            <Link
                href={localizedHref(locale, article.href)}
                className={cx(
                    'group flex h-full flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                )}
            >
                {article.cover ? (
                    <picture>
                        {article.cover_webp ? (
                            <source srcSet={article.cover_webp} type="image/webp" />
                        ) : null}
                        <img
                            src={article.cover}
                            alt=""
                            width={640}
                            height={400}
                            loading="lazy"
                            decoding="async"
                            className="aspect-[16/10] w-full object-cover bg-navy-100"
                            onError={(event) => {
                                event.currentTarget.style.display = 'none';
                            }}
                        />
                    </picture>
                ) : (
                    <div
                        className="aspect-[16/10] w-full bg-gradient-to-br from-navy-900 to-navy-700"
                        aria-hidden="true"
                    />
                )}
                <div className="flex flex-1 flex-col p-5">
                    <header className="text-xs uppercase tracking-[0.14em] text-muted">
                        {article.published_at ? (
                            <time dateTime={article.published_at}>
                                {formatDate(article.published_at, locale)}
                            </time>
                        ) : null}
                        <span className="mx-2" aria-hidden="true">
                            ·
                        </span>
                        <span>
                            {t('articles.readingTime', {
                                minutes: article.reading_time ?? 1,
                            })}
                        </span>
                    </header>
                    <h2 className="mt-3 font-display text-xl text-text group-hover:border-b group-hover:border-accent">
                        {article.title}
                    </h2>
                    {article.excerpt ? (
                        <p className="mt-3 flex-1 text-sm leading-6 text-muted [html[lang=my]_&]:leading-[1.8]">
                            {article.excerpt}
                        </p>
                    ) : null}
                    {article.author?.name ? (
                        <p className="mt-4 text-sm text-muted">
                            {article.author.name}
                        </p>
                    ) : null}
                </div>
            </Link>
        </article>
    );
}
