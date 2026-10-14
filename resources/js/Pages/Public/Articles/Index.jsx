import ArticleCard from '@/Components/public/ArticleCard';
import Breadcrumb from '@/Components/public/Breadcrumb';
import EmptyState from '@/Components/public/EmptyState';
import ListSkeleton from '@/Components/public/ListSkeleton';
import PageHero from '@/Components/public/PageHero';
import Pagination from '@/Components/public/Pagination';
import Container from '@/Components/ui/Container';
import { cx } from '@/lib/cx';
import { localizedHref } from '@/lib/navigation';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ArticlesIndex({
    category,
    categories = [],
    articles,
}) {
    const { t } = useTranslation();
    const locale = usePage().props.locale ?? 'my';
    const [loading, setLoading] = useState(false);
    const items = articles?.data ?? [];
    const active =
        categories.find((item) => item.value === category) ?? categories[0];

    useEffect(() => {
        const offStart = router.on('start', () => setLoading(true));
        const offFinish = router.on('finish', () => setLoading(false));

        return () => {
            offStart();
            offFinish();
        };
    }, []);

    return (
        <PublicLayout>
            <Head
                title={t('articles.metaTitle', {
                    category: t(
                        active?.label_key ?? 'articles.categories.knowledge',
                    ),
                })}
            >
                <meta
                    head-key="description"
                    name="description"
                    content={t('articles.metaDescription')}
                />
                <link
                    rel="alternate"
                    type="application/rss+xml"
                    title={t('news.rssTitle')}
                    href={localizedHref(locale, '/feed.xml')}
                />
            </Head>

            <Container className="py-12 sm:py-16">
                <Breadcrumb
                    items={[
                        { label: t('nav.home'), href: localizedHref(locale, '/') },
                        { label: t('nav.newsLiterature') },
                        {
                            label: t(
                                active?.label_key ??
                                    'articles.categories.knowledge',
                            ),
                        },
                    ]}
                />
                <PageHero
                    eyebrow={t('articles.eyebrow')}
                    title={t('articles.title')}
                >
                    {t('articles.lead')}
                </PageHero>

                <div
                    role="tablist"
                    aria-label={t('articles.tabsLabel')}
                    className="flex flex-wrap gap-2 border-b border-border pb-4"
                >
                    {categories.map((item) => {
                        const selected = item.value === category;

                        return (
                            <Link
                                key={item.value}
                                href={localizedHref(locale, item.href)}
                                role="tab"
                                aria-selected={selected}
                                className={cx(
                                    'inline-flex min-h-11 items-center border-b px-3 text-sm font-medium',
                                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                                    selected
                                        ? 'border-accent text-text'
                                        : 'border-transparent text-muted hover:text-text',
                                )}
                            >
                                {t(item.label_key)}
                            </Link>
                        );
                    })}
                </div>

                <div className="mt-10" aria-busy={loading}>
                    {loading ? <ListSkeleton count={6} /> : null}

                    {!loading && items.length === 0 ? (
                        <EmptyState
                            title={t('articles.emptyTitle')}
                            description={t('articles.emptyBody')}
                        />
                    ) : null}

                    {!loading && items.length > 0 ? (
                        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {items.map((article) => (
                                <li key={article.id}>
                                    <ArticleCard article={article} />
                                </li>
                            ))}
                        </ul>
                    ) : null}

                    <Pagination
                        meta={articles?.meta}
                        links={articles?.links}
                    />
                </div>
            </Container>
        </PublicLayout>
    );
}
