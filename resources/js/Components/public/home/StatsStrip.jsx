import Container from '@/Components/ui/Container';
import {
    fadeUp,
    motionTransition,
    usePrefersReducedMotion,
} from '@/lib/usePrefersReducedMotion';
import { animate, motion, useInView } from 'framer-motion';
import { useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

/** Demo fallbacks when seeded DB counts are empty. */
const EXAMPLE_STATS = {
    population: 1284500,
    townships: 28,
    schools: 312,
    clinics: 96,
};

const EASE = [0.22, 1, 0.36, 1];

function resolveCount(value, fallback) {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : fallback;
}

function StatValue({ value, reduced, inView }) {
    const [display, setDisplay] = useState(reduced ? value : 0);

    useEffect(() => {
        if (reduced) {
            setDisplay(value);
            return undefined;
        }

        if (!inView) {
            setDisplay(0);
            return undefined;
        }

        const controls = animate(0, value, {
            duration: 1.15,
            ease: EASE,
            onUpdate: (latest) => setDisplay(Math.round(latest)),
        });

        return () => controls.stop();
    }, [inView, reduced, value]);

    return (
        <span className="tabular-nums">
            {display.toLocaleString()}
        </span>
    );
}

export default function StatsStrip({ stats = {} }) {
    const { t } = useTranslation();
    const reduced = usePrefersReducedMotion();
    const labelId = useId();
    const sectionRef = useRef(null);
    const inView = useInView(sectionRef, { once: false, amount: 0.35 });
    const shown = reduced || inView;

    const items = [
        {
            key: 'population',
            label: t('home.stats.population'),
            value: resolveCount(
                stats.population,
                EXAMPLE_STATS.population,
            ),
        },
        {
            key: 'townships',
            label: t('home.stats.townships'),
            value: resolveCount(stats.townships, EXAMPLE_STATS.townships),
        },
        {
            key: 'schools',
            label: t('home.stats.schools'),
            value: resolveCount(stats.schools, EXAMPLE_STATS.schools),
        },
        {
            key: 'clinics',
            label: t('home.stats.clinics'),
            value: resolveCount(stats.clinics, EXAMPLE_STATS.clinics),
        },
    ];

    return (
        <section
            ref={sectionRef}
            data-testid="home-stats"
            className="border-y border-border bg-surface py-8 sm:py-12 lg:py-14"
            aria-labelledby={labelId}
        >
            <Container>
                <motion.header
                    className="mx-auto max-w-2xl text-center"
                    initial={reduced ? false : 'hidden'}
                    animate={shown ? 'show' : 'hidden'}
                    variants={fadeUp}
                    transition={motionTransition(reduced, 0.55)}
                >
                    <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-navy-900/45 sm:text-xs">
                        {t('home.stats.eyebrow')}
                    </p>
                    <h2
                        id={labelId}
                        className="mt-3 font-display text-2xl font-normal tracking-tight text-navy-900 sm:text-[1.75rem]"
                    >
                        {t('home.stats.title')}
                    </h2>
                    <span
                        className="mx-auto mt-4 block h-px w-12 bg-accent/70"
                        aria-hidden="true"
                    />
                    <p className="mt-4 text-sm leading-6 text-[#6b6b6b] sm:text-base">
                        {t('home.stats.lead')}
                    </p>
                </motion.header>

                <ul className="mt-8 grid grid-cols-2 gap-8 sm:mt-10 lg:grid-cols-4 lg:gap-10">
                    {items.map((item, index) => (
                        <motion.li
                            key={item.key}
                            className="min-w-0 text-center"
                            initial={
                                reduced ? false : { opacity: 0, y: 18 }
                            }
                            animate={
                                shown
                                    ? { opacity: 1, y: 0 }
                                    : { opacity: 0, y: 18 }
                            }
                            transition={{
                                duration: reduced ? 0 : 0.45,
                                ease: EASE,
                                delay: reduced
                                    ? 0
                                    : shown
                                      ? 0.2 + index * 0.08
                                      : 0,
                            }}
                        >
                            <p className="font-display text-2xl font-bold tracking-tight text-navy-950 sm:text-3xl md:text-4xl md:leading-none">
                                <StatValue
                                    value={item.value}
                                    reduced={reduced}
                                    inView={shown}
                                />
                            </p>
                            <p className="mt-2 text-sm text-muted sm:mt-3 sm:text-base">
                                {item.label}
                            </p>
                        </motion.li>
                    ))}
                </ul>
            </Container>
        </section>
    );
}
