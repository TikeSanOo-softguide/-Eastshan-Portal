import Container from '@/Components/ui/Container';
import SectionTitle from '@/Components/ui/SectionTitle';
import { cx } from '@/lib/cx';
import { localizedHref } from '@/lib/navigation';
import {
    motionTransition,
    usePrefersReducedMotion,
} from '@/lib/usePrefersReducedMotion';
import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FadeIn from './FadeIn';

function chunk(items, size) {
    const groups = [];

    for (let index = 0; index < items.length; index += size) {
        groups.push(items.slice(index, index + size));
    }

    return groups;
}

export default function LeadershipCarousel({ leaders = [] }) {
    const { t } = useTranslation();
    const locale = usePage().props.locale ?? 'my';
    const reduced = usePrefersReducedMotion();
    const labelId = useId();
    const [page, setPage] = useState(0);
    const [perPage, setPerPage] = useState(3);

    useEffect(() => {
        const update = () => {
            if (window.matchMedia('(min-width: 1024px)').matches) {
                setPerPage(3);
            } else if (window.matchMedia('(min-width: 640px)').matches) {
                setPerPage(2);
            } else {
                setPerPage(1);
            }
        };

        update();
        window.addEventListener('resize', update);

        return () => window.removeEventListener('resize', update);
    }, []);

    const pages = chunk(leaders, perPage);
    const pageCount = Math.max(pages.length, 1);
    const safePage = Math.min(page, pageCount - 1);
    const visible = pages[safePage] ?? [];

    useEffect(() => {
        setPage(0);
    }, [perPage, leaders.length]);

    const go = (direction) => {
        setPage((current) => {
            const next = current + direction;

            if (next < 0) {
                return pageCount - 1;
            }

            if (next >= pageCount) {
                return 0;
            }

            return next;
        });
    };

    return (
        <section
            data-testid="home-leadership"
            className="border-t border-border bg-surface py-16 sm:py-24"
            aria-labelledby={labelId}
        >
            <Container>
                <FadeIn>
                    <div className="flex flex-wrap items-end justify-between gap-6">
                        <SectionTitle
                            as="h2"
                            id={labelId}
                            eyebrow={t('home.leadership.eyebrow')}
                            title={t('home.leadership.title')}
                        >
                            {t('home.leadership.lead')}
                        </SectionTitle>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                className={cx(
                                    'inline-flex min-h-11 min-w-11 items-center justify-center border border-border text-text',
                                    'hover:bg-text/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                                )}
                                aria-label={t('home.leadership.prev')}
                                onClick={() => go(-1)}
                                disabled={pageCount <= 1}
                            >
                                <ChevronLeft
                                    className="size-5"
                                    aria-hidden="true"
                                />
                            </button>
                            <button
                                type="button"
                                className={cx(
                                    'inline-flex min-h-11 min-w-11 items-center justify-center border border-border text-text',
                                    'hover:bg-text/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                                )}
                                aria-label={t('home.leadership.next')}
                                onClick={() => go(1)}
                                disabled={pageCount <= 1}
                            >
                                <ChevronRight
                                    className="size-5"
                                    aria-hidden="true"
                                />
                            </button>
                        </div>
                    </div>
                </FadeIn>

                {!leaders.length ? (
                    <p className="mt-8 text-sm text-muted">
                        {t('home.leadership.empty')}
                    </p>
                ) : (
                    <div
                        className="mt-10"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        <AnimatePresence mode="wait">
                            <motion.ul
                                key={`${safePage}-${perPage}`}
                                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                                initial={
                                    reduced ? false : { opacity: 0, y: 12 }
                                }
                                animate={{ opacity: 1, y: 0 }}
                                exit={
                                    reduced
                                        ? { opacity: 1, y: 0 }
                                        : { opacity: 0, y: -8 }
                                }
                                transition={motionTransition(reduced, 0.45)}
                            >
                                {visible.map((leader) => (
                                    <li key={leader.id} className="min-w-0">
                                        <article className="h-full">
                                            <img
                                                src={leader.photo}
                                                alt=""
                                                width={480}
                                                height={600}
                                                loading="lazy"
                                                decoding="async"
                                                className="aspect-[4/5] w-full object-cover bg-navy-100"
                                            />
                                            <h3 className="mt-4 font-display text-xl text-text">
                                                {leader.name}
                                            </h3>
                                            <p className="mt-1 text-sm text-muted">
                                                {leader.position}
                                            </p>
                                            {leader.institution ? (
                                                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-muted">
                                                    {leader.institution}
                                                </p>
                                            ) : null}
                                        </article>
                                    </li>
                                ))}
                            </motion.ul>
                        </AnimatePresence>
                        <p className="mt-6 text-sm text-muted">
                            {t('home.leadership.page', {
                                current: safePage + 1,
                                total: pageCount,
                            })}
                        </p>
                        <Link
                            href={localizedHref(locale, '/leadership')}
                            className={cx(
                                'mt-4 inline-flex min-h-11 items-center border-b border-accent text-sm font-medium text-text',
                                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                            )}
                        >
                            {t('home.leadership.viewAll')}
                        </Link>
                    </div>
                )}
            </Container>
        </section>
    );
}
