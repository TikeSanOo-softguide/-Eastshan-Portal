import FeaturedGrid from '@/Components/public/home/FeaturedGrid';
import HeroSection from '@/Components/public/home/HeroSection';
import LatestFeeds from '@/Components/public/home/LatestFeeds';
import LeadershipCarousel from '@/Components/public/home/LeadershipCarousel';
import StatsStrip from '@/Components/public/home/StatsStrip';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Home({
    stats = {},
    news = [],
    articles = [],
    leaders = [],
}) {
    const { t } = useTranslation();

    return (
        <PublicLayout>
            <Head title={t('home.title')} />
            <HeroSection />
            <FeaturedGrid />
            <StatsStrip stats={stats} />
            <LatestFeeds news={news} articles={articles} />
            <LeadershipCarousel leaders={leaders} />
        </PublicLayout>
    );
}
