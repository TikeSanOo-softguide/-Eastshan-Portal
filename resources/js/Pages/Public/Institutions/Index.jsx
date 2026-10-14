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

export default function InstitutionsIndex({
    institutions,
    filters = {},
    types = [],
}) {
    const { t } = useTranslation();
    const locale = usePage().props.locale ?? 'my';
    const [q, setQ] = useState(filters.q ?? '');
    const [type, setType] = useState(filters.type ?? '');
    const [loading, setLoading] = useState(false);
    const items = institutions?.data ?? [];

    useEffect(() => {
        setQ(filters.q ?? '');
        setType(filters.type ?? '');
    }, [filters.q, filters.type]);

    useEffect(() => {
        const offStart = router.on('start', () => setLoading(true));
        const offFinish = router.on('finish', () => setLoading(false));

        return () => {
            offStart();
            offFinish();
        };
    }, []);

    const applyFilters = (next = {}) => {
        router.get(
            localizedHref(locale, '/institutions'),
            {
                q: next.q ?? q,
                type: next.type ?? type,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    return (
        <PublicLayout>
            <Head title={t('institutions.metaTitle')}>
                <meta
                    head-key="description"
                    name="description"
                    content={t('institutions.metaDescription')}
                />
            </Head>

            <Container className="py-12 sm:py-16">
                <Breadcrumb
                    items={[
                        {
                            label: t('nav.home'),
                            href: localizedHref(locale, '/'),
                        },
                        { label: t('nav.institutions') },
                    ]}
                />
                <PageHero
                    eyebrow={t('institutions.eyebrow')}
                    title={t('institutions.title')}
                >
                    {t('institutions.lead')}
                </PageHero>

                <form
                    className="flex flex-col gap-3 border border-border bg-surface p-4 sm:flex-row sm:items-end"
                    onSubmit={(event) => {
                        event.preventDefault();
                        applyFilters();
                    }}
                >
                    <label className="block min-w-0 flex-1 text-sm">
                        <span className="mb-2 block text-muted">
                            {t('institutions.searchLabel')}
                        </span>
                        <input
                            type="search"
                            value={q}
                            onChange={(event) => setQ(event.target.value)}
                            className="min-h-11 w-full border-border bg-bg text-sm focus:border-accent focus:ring-accent"
                        />
                    </label>
                    <label className="block w-full text-sm sm:w-56">
                        <span className="mb-2 block text-muted">
                            {t('institutions.typeLabel')}
                        </span>
                        <select
                            value={type}
                            onChange={(event) => {
                                const next = event.target.value;
                                setType(next);
                                applyFilters({ type: next });
                            }}
                            className="min-h-11 w-full border-border bg-bg text-sm focus:border-accent focus:ring-accent"
                        >
                            <option value="">
                                {t('institutions.allTypes')}
                            </option>
                            {types.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {t(item.label_key)}
                                </option>
                            ))}
                        </select>
                    </label>
                    <button
                        type="submit"
                        className="inline-flex min-h-11 items-center justify-center bg-primary px-5 text-sm font-medium text-on-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                        {t('institutions.apply')}
                    </button>
                </form>

                <div className="mt-10" aria-busy={loading}>
                    {loading ? <ListSkeleton count={6} /> : null}

                    {!loading && items.length === 0 ? (
                        <EmptyState
                            title={t('institutions.emptyTitle')}
                            description={t('institutions.emptyBody')}
                        />
                    ) : null}

                    {!loading && items.length > 0 ? (
                        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {items.map((item) => (
                                <li key={item.id}>
                                    <Link
                                        href={localizedHref(
                                            locale,
                                            `/institutions/${item.slug}`,
                                        )}
                                        className={cx(
                                            'block h-full border border-border bg-surface p-5 transition-transform duration-300 ease-out hover:-translate-y-0.5',
                                            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                                            'motion-reduce:transition-none motion-reduce:hover:translate-y-0',
                                        )}
                                    >
                                        <p className="text-xs uppercase tracking-[0.14em] text-muted">
                                            {t(
                                                `institutions.types.${item.type}`,
                                            )}
                                        </p>
                                        <h2 className="mt-3 font-display text-xl text-text">
                                            {item.name}
                                        </h2>
                                        {item.address ? (
                                            <p className="mt-3 text-sm text-muted">
                                                {item.address}
                                            </p>
                                        ) : null}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : null}

                    <Pagination
                        meta={institutions?.meta}
                        links={institutions?.links}
                    />
                </div>
            </Container>
        </PublicLayout>
    );
}
