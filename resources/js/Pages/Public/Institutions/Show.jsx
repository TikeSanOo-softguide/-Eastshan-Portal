import Breadcrumb from '@/Components/public/Breadcrumb';
import InstitutionTree from '@/Components/public/InstitutionTree';
import RichText from '@/Components/public/RichText';
import Container from '@/Components/ui/Container';
import { localizedHref } from '@/lib/navigation';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function InstitutionShow({ institution }) {
    const { t } = useTranslation();
    const locale = usePage().props.locale ?? 'my';
    const description =
        institution.description_excerpt || t('institutions.metaDescription');

    return (
        <PublicLayout>
            <Head
                title={t('institutions.detailMetaTitle', {
                    name: institution.name,
                })}
            >
                <meta
                    head-key="description"
                    name="description"
                    content={description}
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
                            label: t('nav.institutions'),
                            href: localizedHref(locale, '/institutions'),
                        },
                        { label: institution.name },
                    ]}
                />

                <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.8fr)]">
                    <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-muted">
                            {t(`institutions.types.${institution.type}`)}
                        </p>
                        <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-text">
                            {institution.name}
                        </h1>
                        <span
                            className="mt-4 block h-px w-14 bg-accent"
                            aria-hidden="true"
                        />
                        <div className="mt-8">
                            <RichText html={institution.description_html} />
                        </div>

                        <section className="mt-12">
                            <h2 className="font-display text-2xl text-text">
                                {t('institutions.subDepartments')}
                            </h2>
                            <div className="mt-4">
                                <InstitutionTree
                                    nodes={institution.children}
                                    emptyLabel={t('institutions.noDepartments')}
                                />
                            </div>
                        </section>

                        <section className="mt-12">
                            <h2 className="font-display text-2xl text-text">
                                {t('institutions.leadership')}
                            </h2>
                            {institution.leaders?.length ? (
                                <ul className="mt-6 grid gap-5 sm:grid-cols-2">
                                    {institution.leaders.map((leader) => (
                                        <li
                                            key={leader.id}
                                            className="border border-border bg-surface p-4"
                                        >
                                            <div className="flex gap-4">
                                                <img
                                                    src={leader.photo}
                                                    alt=""
                                                    width={96}
                                                    height={120}
                                                    loading="lazy"
                                                    className="h-28 w-24 object-cover bg-navy-100"
                                                />
                                                <div className="min-w-0">
                                                    <h3 className="font-display text-lg text-text">
                                                        {leader.name}
                                                    </h3>
                                                    <p className="mt-1 text-sm text-muted">
                                                        {leader.position}
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="mt-4 text-sm text-muted">
                                    {t('institutions.noLeaders')}
                                </p>
                            )}
                        </section>
                    </div>

                    <aside className="border border-border bg-surface p-6 h-fit">
                        <h2 className="font-display text-xl text-text">
                            {t('institutions.contact')}
                        </h2>
                        <span
                            className="mt-3 block h-px w-10 bg-accent"
                            aria-hidden="true"
                        />
                        <dl className="mt-5 space-y-4 text-sm">
                            <div>
                                <dt className="text-muted">
                                    {t('institutions.address')}
                                </dt>
                                <dd className="mt-1 text-text">
                                    {institution.address ||
                                        t('common.notAvailable')}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted">
                                    {t('institutions.phone')}
                                </dt>
                                <dd className="mt-1 text-text">
                                    {institution.phone ||
                                        t('common.notAvailable')}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted">
                                    {t('institutions.email')}
                                </dt>
                                <dd className="mt-1 break-all text-text">
                                    {institution.email ||
                                        t('common.notAvailable')}
                                </dd>
                            </div>
                        </dl>
                    </aside>
                </div>
            </Container>
        </PublicLayout>
    );
}
