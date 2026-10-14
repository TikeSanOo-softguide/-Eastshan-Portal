import Breadcrumb from '@/Components/public/Breadcrumb';
import EmptyState from '@/Components/public/EmptyState';
import RichText from '@/Components/public/RichText';
import Container from '@/Components/ui/Container';
import { cx } from '@/lib/cx';
import { localizedHref } from '@/lib/navigation';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

const sectionNavKey = {
    history: 'nav.history',
    socio_economy: 'nav.socioEconomy',
    religion: 'nav.religion',
    heritage: 'nav.heritage',
    customs: 'nav.customs',
};

function sectionPath(section) {
    return section === 'heritage'
        ? '/heritage'
        : section === 'socio_economy'
          ? '/about/socio-economy'
          : `/about/${section}`;
}

export default function AboutShow({
    section,
    page,
    related = [],
    siblings = [],
}) {
    const { t } = useTranslation();
    const locale = usePage().props.locale ?? 'my';
    const sectionLabel = t(sectionNavKey[section] ?? 'nav.about');
    const basePath = sectionPath(section);

    if (!page) {
        return (
            <PublicLayout>
                <Head title={sectionLabel}>
                    <meta
                        head-key="description"
                        name="description"
                        content={t('about.metaDescription')}
                    />
                </Head>
                <Container className="py-12 sm:py-16">
                    <Breadcrumb
                        items={[
                            {
                                label: t('nav.home'),
                                href: localizedHref(locale, '/'),
                            },
                            { label: sectionLabel },
                        ]}
                    />
                    <EmptyState
                        title={t('about.emptyTitle')}
                        description={t('about.emptyBody')}
                    />
                </Container>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout>
            <Head title={page.title}>
                <meta
                    head-key="description"
                    name="description"
                    content={page.excerpt || t('about.metaDescription')}
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
                            label: t('nav.about'),
                            href: localizedHref(locale, '/about/history'),
                        },
                        { label: sectionLabel },
                        { label: page.title },
                    ]}
                />

                {page.cover ? (
                    <img
                        src={page.cover}
                        alt=""
                        width={1200}
                        height={640}
                        className="mb-10 aspect-[21/9] w-full object-cover bg-navy-100"
                        onError={(event) => {
                            event.currentTarget.style.display = 'none';
                        }}
                    />
                ) : (
                    <div
                        className="mb-10 aspect-[21/9] w-full bg-gradient-to-br from-navy-900 to-navy-700"
                        aria-hidden="true"
                    />
                )}

                <div className="grid gap-12 lg:grid-cols-[minmax(14rem,0.35fr)_minmax(0,1fr)]">
                    <aside className="order-2 lg:order-1">
                        <div className="sticky top-28 space-y-8">
                            <div>
                                <h2 className="font-display text-lg text-text">
                                    {t('about.toc')}
                                </h2>
                                <span
                                    className="mt-3 block h-px w-10 bg-accent"
                                    aria-hidden="true"
                                />
                                <ul className="mt-4 space-y-1">
                                    {(page.toc ?? []).map((item) => (
                                        <li key={item.id}>
                                            <a
                                                href={`#${item.id}`}
                                                className="inline-flex min-h-11 items-center text-sm text-muted hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                                            >
                                                {item.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {siblings.length > 1 ? (
                                <div>
                                    <h2 className="font-display text-lg text-text">
                                        {t('about.inThisSection')}
                                    </h2>
                                    <ul className="mt-4 space-y-1">
                                        {siblings.map((item) => (
                                            <li key={item.id}>
                                                <Link
                                                    href={localizedHref(
                                                        locale,
                                                        `${basePath}?page=${item.slug}`,
                                                    )}
                                                    className={cx(
                                                        'inline-flex min-h-11 items-center border-b text-sm',
                                                        item.slug === page.slug
                                                            ? 'border-accent text-text'
                                                            : 'border-transparent text-muted hover:text-text',
                                                    )}
                                                    aria-current={
                                                        item.slug === page.slug
                                                            ? 'page'
                                                            : undefined
                                                    }
                                                >
                                                    {item.title}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : null}

                            {related.length ? (
                                <div>
                                    <h2 className="font-display text-lg text-text">
                                        {t('about.related')}
                                    </h2>
                                    <ul className="mt-4 space-y-3">
                                        {related.map((item) => (
                                            <li key={item.id}>
                                                <Link
                                                    href={localizedHref(
                                                        locale,
                                                        `${item.href}?page=${item.slug}`,
                                                    )}
                                                    className="block text-sm text-text hover:border-b hover:border-accent"
                                                >
                                                    {item.title}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : null}
                        </div>
                    </aside>

                    <article className="order-1 min-w-0 lg:order-2">
                        <p className="text-xs uppercase tracking-[0.16em] text-muted">
                            {sectionLabel}
                        </p>
                        <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-text">
                            {page.title}
                        </h1>
                        <span
                            className="mt-4 block h-px w-14 bg-accent"
                            aria-hidden="true"
                        />
                        <div className="mt-8">
                            <RichText html={page.body_html} />
                        </div>
                    </article>
                </div>
            </Container>
        </PublicLayout>
    );
}
