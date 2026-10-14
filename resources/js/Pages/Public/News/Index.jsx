import Breadcrumb from '@/Components/public/Breadcrumb';
import EmptyState from '@/Components/public/EmptyState';
import ListSkeleton from '@/Components/public/ListSkeleton';
import NewsDigestItem from '@/Components/public/NewsDigestItem';
import PageHero from '@/Components/public/PageHero';
import Pagination from '@/Components/public/Pagination';
import Container from '@/Components/ui/Container';
import { localizedHref } from '@/lib/navigation';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function NewsIndex({
    news,
    filters = {},
    categories = [],
}) {
    const { t } = useTranslation();
    const locale = usePage().props.locale ?? 'my';
    const [category, setCategory] = useState(filters.category ?? '');
    const [from, setFrom] = useState(filters.from ?? '');
    const [to, setTo] = useState(filters.to ?? '');
    const [loading, setLoading] = useState(false);
    const items = news?.data ?? [];

    useEffect(() => {
        setCategory(filters.category ?? '');
        setFrom(filters.from ?? '');
        setTo(filters.to ?? '');
    }, [filters.category, filters.from, filters.to]);

    useEffect(() => {
        const offStart = router.on('start', () => setLoading(true));
        const offFinish = router.on('finish', () => setLoading(false));

        return () => {
            offStart();
            offFinish();
        };
    }, []);

    const apply = (next = {}) => {
        router.get(
            localizedHref(locale, '/news'),
            {
                category: next.category ?? category,
                from: next.from ?? from,
                to: next.to ?? to,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    return (
        <PublicLayout>
            <Head title={t('news.metaTitle')}>
                <meta
                    head-key="description"
                    name="description"
                    content={t('news.metaDescription')}
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
                        { label: t('nav.dailyNews') },
                    ]}
                />
                <PageHero eyebrow={t('news.eyebrow')} title={t('news.title')}>
                    {t('news.lead')}
                </PageHero>

                <form
                    className="grid gap-3 border border-border bg-surface p-4 sm:grid-cols-2 lg:grid-cols-4"
                    onSubmit={(event) => {
                        event.preventDefault();
                        apply();
                    }}
                >
                    <label className="block text-sm">
                        <span className="mb-2 block text-muted">
                            {t('news.categoryLabel')}
                        </span>
                        <select
                            value={category}
                            onChange={(event) => {
                                const next = event.target.value;
                                setCategory(next);
                                apply({ category: next });
                            }}
                            className="min-h-11 w-full border-border bg-bg text-sm focus:border-accent focus:ring-accent"
                        >
                            <option value="">{t('news.allCategories')}</option>
                            {categories.map((item) => (
                                <option key={item.id} value={item.slug}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="block text-sm">
                        <span className="mb-2 block text-muted">
                            {t('news.fromLabel')}
                        </span>
                        <input
                            type="date"
                            value={from}
                            onChange={(event) => setFrom(event.target.value)}
                            className="min-h-11 w-full border-border bg-bg text-sm focus:border-accent focus:ring-accent"
                        />
                    </label>
                    <label className="block text-sm">
                        <span className="mb-2 block text-muted">
                            {t('news.toLabel')}
                        </span>
                        <input
                            type="date"
                            value={to}
                            onChange={(event) => setTo(event.target.value)}
                            className="min-h-11 w-full border-border bg-bg text-sm focus:border-accent focus:ring-accent"
                        />
                    </label>
                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="inline-flex min-h-11 w-full items-center justify-center bg-primary px-5 text-sm font-medium text-on-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                        >
                            {t('news.apply')}
                        </button>
                    </div>
                </form>

                <div className="mt-10" aria-busy={loading}>
                    {loading ? <ListSkeleton count={4} variant="table" /> : null}

                    {!loading && items.length === 0 ? (
                        <EmptyState
                            title={t('news.emptyTitle')}
                            description={t('news.emptyBody')}
                        />
                    ) : null}

                    {!loading && items.length > 0 ? (
                        <div className="max-w-3xl">
                            {items.map((item) => (
                                <NewsDigestItem
                                    key={item.id}
                                    item={item}
                                    locale={locale}
                                />
                            ))}
                        </div>
                    ) : null}

                    <Pagination meta={news?.meta} links={news?.links} />
                </div>
            </Container>
        </PublicLayout>
    );
}
