import AboutShanState from '@/Components/public/home/AboutShanState';
import ConnectedToSR4 from '@/Components/public/home/ConnectedToSR4';
import HeroSection from '@/Components/public/home/HeroSection';
import LatestNewsGrid from '@/Components/public/home/LatestNewsGrid';
import OurLeaders from '@/Components/public/home/OurLeaders';
import StatsStrip from '@/Components/public/home/StatsStrip';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Home({ stats = {}, news = [] }) {
    const { t } = useTranslation();

    return (
        <PublicLayout>
            <Head title={t('home.title')} />
            <HeroSection />
            <div className="relative z-10 bg-bg">
                <AboutShanState />
                <LatestNewsGrid news={news} />
                <OurLeaders />
                <ConnectedToSR4 />
                <StatsStrip stats={stats} />
            </div>
        </PublicLayout>
    );
}
