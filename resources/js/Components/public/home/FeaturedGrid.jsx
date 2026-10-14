import Container from '@/Components/ui/Container';
import SectionTitle from '@/Components/ui/SectionTitle';
import { featuredCards } from '@/lib/homeFeatured';
import {
    staggerChildren,
    usePrefersReducedMotion,
} from '@/lib/usePrefersReducedMotion';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import FeaturedCard from './FeaturedCard';
import FadeIn from './FadeIn';

export default function FeaturedGrid() {
    const { t } = useTranslation();
    const reduced = usePrefersReducedMotion();

    return (
        <section
            id="featured"
            data-testid="home-featured"
            className="scroll-mt-24 bg-bg py-16 sm:py-24"
        >
            <Container>
                <FadeIn>
                    <SectionTitle
                        eyebrow={t('home.featured.eyebrow')}
                        title={t('home.featured.title')}
                    >
                        {t('home.featured.lead')}
                    </SectionTitle>
                </FadeIn>

                <motion.ul
                    className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
                    initial={reduced ? false : 'hidden'}
                    whileInView="show"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={staggerChildren}
                >
                    {featuredCards.map((card, index) => (
                        <li key={card.key} className="min-w-0">
                            <FeaturedCard card={card} index={index} />
                        </li>
                    ))}
                </motion.ul>
            </Container>
        </section>
    );
}
