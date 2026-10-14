import Breadcrumb from '@/Components/public/Breadcrumb';
import EmptyState from '@/Components/public/EmptyState';
import OrgChart from '@/Components/public/OrgChart';
import PageHero from '@/Components/public/PageHero';
import Container from '@/Components/ui/Container';
import { localizedHref } from '@/lib/navigation';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function LeadershipIndex({ groups = [] }) {
    const { t } = useTranslation();
    const locale = usePage().props.locale ?? 'my';

    return (
        <PublicLayout>
            <Head title={t('leadership.metaTitle')}>
                <meta
                    head-key="description"
                    name="description"
                    content={t('leadership.metaDescription')}
                />
            </Head>

            <Container className="py-12 sm:py-16">
                <Breadcrumb
                    items={[
                        {
                            label: t('nav.home'),
                            href: localizedHref(locale, '/'),
                        },
                        { label: t('nav.leadership') },
                    ]}
                />
                <PageHero
                    eyebrow={t('leadership.eyebrow')}
                    title={t('leadership.title')}
                >
                    {t('leadership.lead')}
                </PageHero>

                {groups.length === 0 ? (
                    <EmptyState
                        title={t('leadership.emptyTitle')}
                        description={t('leadership.emptyBody')}
                    />
                ) : (
                    <OrgChart groups={groups} />
                )}
            </Container>
        </PublicLayout>
    );
}
