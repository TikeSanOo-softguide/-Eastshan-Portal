import Breadcrumb from '@/Components/public/Breadcrumb';
import EmptyState from '@/Components/public/EmptyState';
import ListSkeleton from '@/Components/public/ListSkeleton';
import PageHero from '@/Components/public/PageHero';
import Pagination from '@/Components/public/Pagination';
import Container from '@/Components/ui/Container';
import { formatDate } from '@/lib/formatDate';
import { localizedHref } from '@/lib/navigation';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function SearchIndex({ filters = {}, results }) {
    const { t } = useTranslation();
    const locale = usePage().props.locale ?? 'my';
    const [q, setQ] = useState(filters.q ?? '');
    const [loading, setLoading] = useState(false);
    const items = results?.data ?? [];

    useEffect(() => {
        setQ(filters.q ?? '');
    }, [filters.q]);

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
            <Head title={t('search.metaTitle')}>
                <meta
                    head-key="description"
                    name="description"
                    content={t('search.metaDescription')}
                />
            </Head>

            <Container className="py-12 sm:py-16">
                <Breadcrumb
                    items={[
                        { label: t('nav.home'), href: localizedHref(locale, '/') },
                        { label: t('nav.search') },
                    ]}
                />
                <PageHero eyebrow={t('search.eyebrow')} title={t('search.title')}>
                    {t('search.lead')}
                </PageHero>

                <form
                    role="search"
                    className="flex flex-col gap-3 border border-border bg-surface p-4 sm:flex-row"
                    onSubmit={(event) => {
                        event.preventDefault();
                        router.get(
                            localizedHref(locale, '/search'),
                            { q },
                            {
                                preserveState: true,
                                preserveScroll: true,
                                replace: true,
                            },
                        );
                    }}
                >
                    <label className="block min-w-0 flex-1 text-sm">
                        <span className="mb-2 block text-muted">
                            {t('nav.searchLabel')}
                        </span>
                        <input
                            type="search"
                            name="q"
                            value={q}
                            onChange={(event) => setQ(event.target.value)}
                            className="min-h-11 w-full border-border bg-bg text-sm focus:border-accent focus:ring-accent"
                        />
                    </label>
                    <button
                        type="submit"
                        className="inline-flex min-h-11 items-center justify-center bg-primary px-5 text-sm font-medium text-on-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:self-end"
                    >
                        {t('nav.searchSubmit')}
                    </button>
                </form>

                <div className="mt-10" aria-busy={loading}>
                    {loading ? <ListSkeleton count={4} variant="table" /> : null}

                    {!loading && !filters.q ? (
                        <EmptyState
                            title={t('search.promptTitle')}
                            description={t('search.promptBody')}
                        />
                    ) : null}

                    {!loading && filters.q && items.length === 0 ? (
                        <EmptyState
                            title={t('search.emptyTitle')}
                            description={t('search.emptyBody', {
                                query: filters.q,
                            })}
                        />
                    ) : null}

                    {!loading && items.length > 0 ? (
                        <ul className="divide-y divide-border border-t border-border">
                            {items.map((item) => (
                                <li key={`${item.type}-${item.id}`}>
                                    <Link
                                        href={localizedHref(locale, item.href)}
                                        className="block py-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                                    >
                                        <p className="text-xs uppercase tracking-[0.14em] text-muted">
                                            {t(`search.types.${item.type}`)}
                                            {item.published_at
                                                ? ` · ${formatDate(item.published_at, locale)}`
                                                : ''}
                                        </p>
                                        <h2 className="mt-2 font-display text-xl text-text">
                                            {item.title}
                                        </h2>
                                        {item.excerpt ? (
                                            <p className="mt-2 max-w-prose text-sm leading-6 text-muted [html[lang=my]_&]:leading-[1.8]">
                                                {item.excerpt}
                                            </p>
                                        ) : null}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : null}

                    <Pagination
                        meta={results?.meta}
                        links={results?.links}
                    />
                </div>
            </Container>
        </PublicLayout>
    );
}
