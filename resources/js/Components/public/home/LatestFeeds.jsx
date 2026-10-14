import Container from '@/Components/ui/Container';
import SectionTitle from '@/Components/ui/SectionTitle';
import { cx } from '@/lib/cx';
import { formatDate } from '@/lib/formatDate';
import { localizedHref } from '@/lib/navigation';
import { Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import FadeIn from './FadeIn';

function NewsFeedList({ items, emptyLabel, locale }) {
    const { t } = useTranslation();

    if (!items?.length) {
        return <p className="mt-6 text-sm text-muted">{emptyLabel}</p>;
    }

    return (
        <ul className="mt-6 divide-y divide-border border-t border-border">
            {items.map((item) => (
                <li key={item.id} className="py-5">
                    <article>
                        <header className="text-xs uppercase tracking-[0.14em] text-muted">
                            {item.published_at ? (
                                <time dateTime={item.published_at}>
                                    {formatDate(item.published_at, locale)}
                                </time>
                            ) : null}
                        </header>
                        <h3 className="mt-2 font-display text-xl text-text">
                            {item.title}
                        </h3>
                        {item.excerpt ? (
                            <p className="mt-2 text-sm leading-6 text-muted [html[lang=my]_&]:leading-[1.8]">
                                {item.excerpt}
                            </p>
                        ) : null}
                        {(item.source_name || item.source_url) && (
                            <p className="mt-3 text-sm">
                                <span className="text-muted">
                                    {t('news.source')}:{' '}
                                </span>
                                {item.source_url ? (
                                    <a
                                        href={item.source_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-medium text-text underline decoration-accent underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                                    >
                                        {item.source_name || item.source_url}
                                    </a>
                                ) : (
                                    <span className="font-medium text-text">
                                        {item.source_name}
                                    </span>
                                )}
                            </p>
                        )}
                    </article>
                </li>
            ))}
        </ul>
    );
}

function ArticleFeedList({ items, emptyLabel, locale }) {
    if (!items?.length) {
        return <p className="mt-6 text-sm text-muted">{emptyLabel}</p>;
    }

    return (
        <ul className="mt-6 divide-y divide-border border-t border-border">
            {items.map((item) => (
                <li key={item.id}>
                    <Link
                        href={localizedHref(locale, item.href)}
                        className={cx(
                            'block py-5 transition-colors hover:bg-text/[0.02]',
                            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                        )}
                    >
                        <p className="text-xs uppercase tracking-[0.14em] text-muted">
                            {item.published_at
                                ? formatDate(item.published_at, locale)
                                : null}
                        </p>
                        <h3 className="mt-2 font-display text-xl text-text">
                            {item.title}
                        </h3>
                        {item.excerpt ? (
                            <p className="mt-2 text-sm leading-6 text-muted [html[lang=my]_&]:leading-[1.8]">
                                {item.excerpt}
                            </p>
                        ) : null}
                    </Link>
                </li>
            ))}
        </ul>
    );
}

export default function LatestFeeds({ news = [], articles = [] }) {
    const { t } = useTranslation();
    const locale = usePage().props.locale ?? 'my';

    return (
        <section data-testid="home-feeds" className="bg-bg py-16 sm:py-24">
            <Container>
                <div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
                    <FadeIn>
                        <SectionTitle
                            eyebrow={t('home.news.eyebrow')}
                            title={t('home.news.title')}
                        >
                            {t('home.news.lead')}
                        </SectionTitle>
                        <NewsFeedList
                            items={news}
                            emptyLabel={t('home.news.empty')}
                            locale={locale}
                        />
                        <Link
                            href={localizedHref(locale, '/news')}
                            className={cx(
                                'mt-6 inline-flex min-h-11 items-center border-b border-accent text-sm font-medium text-text',
                                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                            )}
                        >
                            {t('home.news.viewAll')}
                        </Link>
                    </FadeIn>

                    <FadeIn delay={1}>
                        <SectionTitle
                            eyebrow={t('home.articles.eyebrow')}
                            title={t('home.articles.title')}
                        >
                            {t('home.articles.lead')}
                        </SectionTitle>
                        <ArticleFeedList
                            items={articles}
                            emptyLabel={t('home.articles.empty')}
                            locale={locale}
                        />
                        <Link
                            href={localizedHref(locale, '/articles/knowledge')}
                            className={cx(
                                'mt-6 inline-flex min-h-11 items-center border-b border-accent text-sm font-medium text-text',
                                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                            )}
                        >
                            {t('home.articles.viewAll')}
                        </Link>
                    </FadeIn>
                </div>
            </Container>
        </section>
    );
}
