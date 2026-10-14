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

function StatBars({ bars = [] }) {
    const { t } = useTranslation();

    if (!bars.length) {
        return <span className="text-muted">—</span>;
    }

    return (
        <ul className="space-y-2">
            {bars.map((bar) => (
                <li key={bar.key}>
                    <div className="flex justify-between gap-3 text-xs text-muted">
                        <span>
                            {t(`infrastructure.stats.${bar.key}`, bar.key)}
                        </span>
                        <span>{bar.value}</span>
                    </div>
                    <div className="mt-1 h-2 w-full bg-border">
                        <div
                            className="h-full bg-accent"
                            style={{ width: `${bar.percent}%` }}
                        />
                    </div>
                </li>
            ))}
        </ul>
    );
}

export default function InfrastructureIndex({
    category,
    categories = [],
    townships = [],
    filters = {},
    summary = {},
    items,
}) {
    const { t } = useTranslation();
    const locale = usePage().props.locale ?? 'my';
    const [township, setTownship] = useState(filters.township ?? '');
    const [loading, setLoading] = useState(false);
    const rows = items?.data ?? [];
    const activeCategory =
        categories.find((item) => item.value === category) ?? categories[0];

    useEffect(() => {
        setTownship(filters.township ?? '');
    }, [filters.township]);

    useEffect(() => {
        const offStart = router.on('start', () => setLoading(true));
        const offFinish = router.on('finish', () => setLoading(false));

        return () => {
            offStart();
            offFinish();
        };
    }, []);

    const visitCategory = (href, nextTownship = township) => {
        router.get(
            localizedHref(locale, href),
            nextTownship ? { township: nextTownship } : {},
            { preserveScroll: true, preserveState: true },
        );
    };

    return (
        <PublicLayout>
            <Head
                title={t('infrastructure.metaTitle', {
                    category: t(
                        activeCategory?.label_key ??
                            'infrastructure.categories.education',
                    ),
                })}
            >
                <meta
                    head-key="description"
                    name="description"
                    content={t('infrastructure.metaDescription')}
                />
            </Head>

            <Container className="py-12 sm:py-16">
                <Breadcrumb
                    items={[
                        {
                            label: t('nav.home'),
                            href: localizedHref(locale, '/'),
                        },
                        {
                            label: t('nav.infrastructure'),
                            href: localizedHref(locale, '/infrastructure'),
                        },
                        {
                            label: t(
                                activeCategory?.label_key ??
                                    'infrastructure.categories.education',
                            ),
                        },
                    ]}
                />
                <PageHero
                    eyebrow={t('infrastructure.eyebrow')}
                    title={t('infrastructure.title')}
                >
                    {t('infrastructure.lead')}
                </PageHero>

                <div
                    role="tablist"
                    aria-label={t('infrastructure.tabsLabel')}
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
                                onClick={(event) => {
                                    event.preventDefault();
                                    visitCategory(item.href);
                                }}
                            >
                                {t(item.label_key)}
                            </Link>
                        );
                    })}
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
                    <label className="block w-full text-sm sm:max-w-xs">
                        <span className="mb-2 block text-muted">
                            {t('infrastructure.townshipLabel')}
                        </span>
                        <select
                            value={township}
                            onChange={(event) => {
                                const next = event.target.value;
                                setTownship(next);
                                visitCategory(
                                    activeCategory?.href ??
                                        '/infrastructure/education',
                                    next,
                                );
                            }}
                            className="min-h-11 w-full border-border bg-surface text-sm focus:border-accent focus:ring-accent"
                        >
                            <option value="">
                                {t('infrastructure.allTownships')}
                            </option>
                            {townships.map((item) => (
                                <option key={item.id} value={item.slug}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        ['total', summary.total],
                        ['operational', summary.operational],
                        ['under_construction', summary.under_construction],
                        ['planned', summary.planned],
                    ].map(([key, value]) => (
                        <li
                            key={key}
                            className="border border-border bg-surface px-5 py-6"
                        >
                            <p className="text-xs uppercase tracking-[0.14em] text-muted">
                                {t(`infrastructure.summary.${key}`)}
                            </p>
                            <p className="mt-3 font-display text-3xl text-text">
                                {value ?? 0}
                            </p>
                        </li>
                    ))}
                </ul>

                <div className="mt-10" aria-busy={loading}>
                    {loading ? (
                        <ListSkeleton count={6} variant="table" />
                    ) : null}

                    {!loading && rows.length === 0 ? (
                        <EmptyState
                            title={t('infrastructure.emptyTitle')}
                            description={t('infrastructure.emptyBody')}
                        />
                    ) : null}

                    {!loading && rows.length > 0 ? (
                        <div className="overflow-x-auto border border-border">
                            <table className="min-w-full text-left text-sm">
                                <thead className="border-b border-border bg-surface">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">
                                            {t('infrastructure.columns.name')}
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            {t(
                                                'infrastructure.columns.township',
                                            )}
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            {t('infrastructure.columns.status')}
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            {t('infrastructure.columns.year')}
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            {t('infrastructure.columns.stats')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((row) => (
                                        <tr
                                            key={row.id}
                                            className="border-b border-border last:border-b-0"
                                        >
                                            <td className="px-4 py-4 align-top text-text">
                                                {row.name}
                                            </td>
                                            <td className="px-4 py-4 align-top text-muted">
                                                {row.township?.name ?? '—'}
                                            </td>
                                            <td className="px-4 py-4 align-top text-muted">
                                                {t(
                                                    `infrastructure.status.${row.status}`,
                                                )}
                                            </td>
                                            <td className="px-4 py-4 align-top text-muted">
                                                {row.year ?? '—'}
                                            </td>
                                            <td className="min-w-[12rem] px-4 py-4 align-top">
                                                <StatBars
                                                    bars={row.stat_bars}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : null}

                    <Pagination meta={items?.meta} links={items?.links} />
                </div>
            </Container>
        </PublicLayout>
    );
}
