import Container from '@/Components/ui/Container';
import {
    motionTransition,
    usePrefersReducedMotion,
} from '@/lib/usePrefersReducedMotion';
import { animate, motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FadeIn from './FadeIn';

function StatValue({ value, reduced }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.6 });
    const [display, setDisplay] = useState(reduced ? value : 0);

    useEffect(() => {
        if (!inView) {
            return undefined;
        }

        if (reduced) {
            setDisplay(value);

            return undefined;
        }

        const controls = animate(0, value, {
            duration: 0.8,
            ease: 'easeOut',
            onUpdate: (latest) => setDisplay(Math.round(latest)),
        });

        return () => controls.stop();
    }, [inView, reduced, value]);

    return (
        <span ref={ref} className="tabular-nums">
            {display.toLocaleString()}
        </span>
    );
}

export default function StatsStrip({ stats }) {
    const { t } = useTranslation();
    const reduced = usePrefersReducedMotion();

    const items = [
        {
            key: 'population',
            label: t('home.stats.population'),
            value: stats.population ?? 0,
        },
        {
            key: 'townships',
            label: t('home.stats.townships'),
            value: stats.townships ?? 0,
        },
        {
            key: 'schools',
            label: t('home.stats.schools'),
            value: stats.schools ?? 0,
        },
        {
            key: 'clinics',
            label: t('home.stats.clinics'),
            value: stats.clinics ?? 0,
        },
    ];

    return (
        <section
            data-testid="home-stats"
            className="border-y border-border bg-surface py-14 sm:py-16"
        >
            <Container>
                <FadeIn>
                    <p className="text-center text-xs font-medium uppercase tracking-[0.16em] text-muted">
                        {t('home.stats.eyebrow')}
                    </p>
                    <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted">
                        {t('home.stats.note')}
                    </p>
                </FadeIn>
                <ul className="mt-10 grid grid-cols-2 gap-8 lg:grid-cols-4">
                    {items.map((item, index) => (
                        <motion.li
                            key={item.key}
                            className="min-w-0 text-center"
                            initial={reduced ? false : { opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.4 }}
                            transition={motionTransition(
                                reduced,
                                0.45 + index * 0.08,
                            )}
                        >
                            <p className="font-display text-3xl text-text sm:text-4xl">
                                <StatValue
                                    value={item.value}
                                    reduced={reduced}
                                />
                            </p>
                            <p className="mt-2 text-sm text-muted">
                                {item.label}
                            </p>
                        </motion.li>
                    ))}
                </ul>
            </Container>
        </section>
    );
}
