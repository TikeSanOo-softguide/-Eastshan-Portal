import Container from '@/Components/ui/Container';
import SectionTitle from '@/Components/ui/SectionTitle';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Section({ titleKey, query = '' }) {
    const { t } = useTranslation();
    const title = t(titleKey);

    return (
        <PublicLayout>
            <Head title={title} />
            <Container className="py-16 sm:py-24">
                <SectionTitle title={title}>
                    {query
                        ? t('nav.searchResults', { query })
                        : t('nav.samplePage')}
                </SectionTitle>
            </Container>
        </PublicLayout>
    );
}
