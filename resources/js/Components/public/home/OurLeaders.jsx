import { cx } from '@/lib/cx';
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion';
import { motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Looping leaders carousel — desktop card ~50% width, arrows flank active card,
 * stronger active elevation, pagination dots.
 */

const LEADERS = [
    {
        id: 1,
        image: '/images/leaders/leader-1.jpg',
        nameKey: 'home.ourLeaders.items.0.name',
        roleKey: 'home.ourLeaders.items.0.role',
        quoteKey: 'home.ourLeaders.items.0.quote',
        mark: 'AM',
    },
    {
        id: 2,
        image: '/images/leaders/leader-2.jpg',
        nameKey: 'home.ourLeaders.items.1.name',
        roleKey: 'home.ourLeaders.items.1.role',
        quoteKey: 'home.ourLeaders.items.1.quote',
        mark: 'HY',
    },
    {
        id: 3,
        image: '/images/leaders/leader-3.jpg',
        nameKey: 'home.ourLeaders.items.2.name',
        roleKey: 'home.ourLeaders.items.2.role',
        quoteKey: 'home.ourLeaders.items.2.quote',
        mark: 'ZL',
    },
    {
        id: 4,
        image: '/images/leaders/leader-4.jpg',
        nameKey: 'home.ourLeaders.items.3.name',
        roleKey: 'home.ourLeaders.items.3.role',
        quoteKey: 'home.ourLeaders.items.3.quote',
        mark: 'TO',
    },
    {
        id: 5,
        image: '/images/leaders/leader-5.jpg',
        nameKey: 'home.ourLeaders.items.4.name',
        roleKey: 'home.ourLeaders.items.4.role',
        quoteKey: 'home.ourLeaders.items.4.quote',
        mark: 'SH',
    },
    {
        id: 6,
        image: '/images/leaders/leader-6.jpg',
        nameKey: 'home.ourLeaders.items.5.name',
        roleKey: 'home.ourLeaders.items.5.role',
        quoteKey: 'home.ourLeaders.items.5.quote',
        mark: 'MT',
    },
];

const GAP_PX = 24;
/** Cap so ultrawide screens do not get an endless card. */
const CARD_MAX_PX = 920;
const EASE = [0.22, 1, 0.36, 1];
const ANIM_MS = 550;

const headerCascade = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.1, delayChildren: 0.04 },
    },
};

const headerItem = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, ease: EASE },
    },
};

/** Active-card share of the track by viewport width. */
function cardRatioForWidth(width) {
    if (width < 640) {
        return 0.86; // phone
    }
    if (width < 768) {
        return 0.8; // large phone / small tablet
    }
    if (width < 1024) {
        return 0.72; // tablet
    }
    if (width < 1280) {
        return 0.64; // laptop
    }
    if (width < 1536) {
        return 0.58; // desktop
    }
    return 0.52; // ultrawide
}

function logicalFromTrack(trackIndex, count) {
    if (trackIndex === 0) {
        return count - 1;
    }
    if (trackIndex === count + 1) {
        return 0;
    }
    return trackIndex - 1;
}

function LeaderCard({ leader, t, active }) {
    return (
        <article
            className={cx(
                'relative flex h-full min-h-[17.5rem] w-full flex-col overflow-hidden rounded-2xl',
                'bg-primary p-3.5',
                'sm:min-h-[18.5rem] sm:flex-row sm:items-center sm:gap-4 sm:p-4 sm:pr-5',
                'md:min-h-[19rem] md:gap-5 md:pr-6',
                'lg:min-h-[19.5rem] lg:gap-6 lg:p-4 lg:pr-6',
                'xl:gap-7',
            )}
        >
            <div
                className={cx(
                    'pointer-events-none absolute inset-0 transition-opacity duration-500',
                    active ? 'opacity-[0.35]' : 'opacity-[0.2]',
                )}
                style={{
                    backgroundImage:
                        'radial-gradient(circle, rgba(255,255,255,0.22) 1px, transparent 1px)',
                    backgroundSize: '12px 12px',
                }}
                aria-hidden="true"
            />

            {/* Fluid portrait — scales with card, stays ~3:4 */}
            <div
                className={cx(
                    'relative z-[1] mx-auto shrink-0 overflow-hidden rounded-xl',
                    'aspect-[3/4] w-[min(68%,13.5rem)]',
                    'sm:mx-0 sm:w-[min(36%,14rem)]',
                    'md:w-[min(34%,14.5rem)]',
                    'lg:w-[min(32%,15.5rem)]',
                    'xl:w-[min(30%,16rem)]',
                    'ring-1 ring-white/15',
                    'shadow-[0_12px_28px_-12px_rgba(0,0,0,0.55)]',
                )}
            >
                <img
                    src={leader.image}
                    alt=""
                    width={304}
                    height={405}
                    className={cx(
                        'h-full w-full object-cover object-top transition duration-500',
                        active
                            ? 'saturate-100 scale-100'
                            : 'saturate-[0.7] scale-[1.02]',
                    )}
                    loading="lazy"
                    decoding="async"
                />
            </div>

            <div className="relative z-[1] mt-3 flex min-h-0 flex-1 flex-col justify-between gap-4 sm:mt-0 sm:min-h-0 sm:gap-5 sm:py-0.5 md:gap-6">
                <blockquote
                    className={cx(
                        'text-[0.98rem] font-normal leading-[1.4] text-on-primary [html[lang=my]_&]:leading-[1.85] sm:text-[1.05rem] sm:leading-[1.4] md:text-[1.1rem] lg:text-[1.15rem]',
                        'transition-opacity duration-500',
                        active ? 'opacity-100' : 'opacity-70',
                    )}
                >
                    “{t(leader.quoteKey)}”
                </blockquote>

                <div className="flex items-end justify-between gap-4">
                    <div className="min-w-0">
                        <p
                            className={cx(
                                'truncate text-base font-medium tracking-tight text-on-primary sm:text-lg',
                                'transition-opacity duration-500',
                                active ? 'opacity-100' : 'opacity-70',
                            )}
                        >
                            {t(leader.nameKey)}
                        </p>
                        <p
                            className={cx(
                                'mt-1 text-sm text-on-primary/70 sm:text-base',
                                'transition-opacity duration-500',
                                active ? 'opacity-100' : 'opacity-70',
                            )}
                        >
                            {t(leader.roleKey)}
                        </p>
                    </div>
                    <span
                        className={cx(
                            'shrink-0 select-none font-display text-4xl font-medium leading-none tracking-tight text-on-primary/15 sm:text-5xl',
                        )}
                        aria-hidden="true"
                    >
                        {leader.mark}
                    </span>
                </div>
            </div>
        </article>
    );
}

export default function OurLeaders() {
    const { t } = useTranslation();
    const reduced = usePrefersReducedMotion();
    const labelId = useId();
    const sectionRef = useRef(null);
    const viewportRef = useRef(null);
    const animatingRef = useRef(false);
    const unlockTimer = useRef(null);
    const touchStartX = useRef(null);
    const inView = useInView(sectionRef, { once: false, amount: 0.25 });
    const [introDone, setIntroDone] = useState(reduced);

    useEffect(() => {
        if (reduced) {
            setIntroDone(true);
            return undefined;
        }
        if (!inView) {
            setIntroDone(false);
            return undefined;
        }
        setIntroDone(false);
        const timer = window.setTimeout(() => setIntroDone(true), 1100);
        return () => window.clearTimeout(timer);
    }, [inView, reduced]);

    const count = LEADERS.length;
    const [cardWidth, setCardWidth] = useState(0);
    const [viewportWidth, setViewportWidth] = useState(0);

    const slides = [LEADERS[count - 1], ...LEADERS, LEADERS[0]];
    const [trackIndex, setTrackIndex] = useState(1);
    const [instant, setInstant] = useState(false);

    const activeLogical = logicalFromTrack(trackIndex, count);

    useEffect(() => {
        const el = viewportRef.current;
        if (!el) {
            return undefined;
        }

        const measure = () => {
            const w = el.clientWidth;
            const ratio = cardRatioForWidth(w);
            setViewportWidth(w);
            setCardWidth(
                Math.min(CARD_MAX_PX, Math.round(w * ratio)),
            );
        };

        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    useEffect(
        () => () => window.clearTimeout(unlockTimer.current),
        [],
    );

    const unlock = useCallback(() => {
        window.clearTimeout(unlockTimer.current);
        unlockTimer.current = window.setTimeout(() => {
            animatingRef.current = false;
        }, ANIM_MS);
    }, []);

    const go = useCallback(
        (dir) => {
            if (animatingRef.current || cardWidth <= 0) {
                return;
            }
            animatingRef.current = true;
            setInstant(false);
            setTrackIndex((current) => current + dir);
            unlock();
        },
        [cardWidth, unlock],
    );

    const goTo = useCallback(
        (logicalIndex) => {
            if (animatingRef.current || cardWidth <= 0) {
                return;
            }
            if (logicalIndex === activeLogical) {
                return;
            }
            animatingRef.current = true;
            setInstant(false);
            setTrackIndex(logicalIndex + 1);
            unlock();
        },
        [activeLogical, cardWidth, unlock],
    );

    useEffect(() => {
        if (trackIndex === 0) {
            const timer = window.setTimeout(() => {
                setInstant(true);
                setTrackIndex(count);
            }, ANIM_MS);
            return () => window.clearTimeout(timer);
        }
        if (trackIndex === count + 1) {
            const timer = window.setTimeout(() => {
                setInstant(true);
                setTrackIndex(1);
            }, ANIM_MS);
            return () => window.clearTimeout(timer);
        }
        return undefined;
    }, [trackIndex, count]);

    useEffect(() => {
        if (!instant) {
            return undefined;
        }
        const id = window.requestAnimationFrame(() => setInstant(false));
        return () => window.cancelAnimationFrame(id);
    }, [instant]);

    const offset =
        cardWidth > 0 ? trackIndex * (cardWidth + GAP_PX) : 0;

    const centerPad =
        cardWidth > 0 && viewportWidth > 0
            ? (viewportWidth - cardWidth) / 2
            : 0;

    // Arrows flank the centered active card (half outside each edge)
    const prevLeft = centerPad;
    const nextLeft = centerPad + cardWidth;

    const onTouchStart = (event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null;
    };

    const onTouchEnd = (event) => {
        if (touchStartX.current == null) {
            return;
        }
        const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
        const delta = endX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(delta) < 48) {
            return;
        }
        go(delta < 0 ? 1 : -1);
    };

    return (
        <section
            ref={sectionRef}
            data-testid="home-our-leaders"
            className="relative z-10 w-full overflow-x-clip bg-white py-8 sm:py-12 lg:py-14"
            aria-labelledby={labelId}
        >
            <div
                className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-navy-950/[0.03] to-transparent"
                aria-hidden="true"
            />

            <div className="relative w-full">
                <motion.header
                    className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8"
                    initial={reduced ? false : 'hidden'}
                    animate={inView || reduced ? 'show' : 'hidden'}
                    variants={reduced ? undefined : headerCascade}
                >
                    <motion.p
                        variants={reduced ? undefined : headerItem}
                        className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-navy-900/45 sm:text-xs"
                    >
                        {t('home.ourLeaders.eyebrow')}
                    </motion.p>
                    <motion.h2
                        id={labelId}
                        variants={reduced ? undefined : headerItem}
                        className="mt-3 font-display text-2xl font-normal tracking-tight text-navy-900 sm:text-[1.75rem]"
                    >
                        {t('home.ourLeaders.title')}
                    </motion.h2>
                    <motion.span
                        variants={reduced ? undefined : headerItem}
                        className="mx-auto mt-4 block h-px w-12 bg-accent/70"
                        aria-hidden="true"
                    />
                    <motion.p
                        variants={reduced ? undefined : headerItem}
                        className="mt-4 text-sm leading-6 text-[#6b6b6b] sm:text-base"
                    >
                        {t('home.ourLeaders.lead')}
                    </motion.p>
                </motion.header>

                <div
                    className="mt-6 w-full sm:mt-8"
                    onTouchStart={onTouchStart}
                    onTouchEnd={onTouchEnd}
                >
                    {/* Track + arrows share one box so arrows center on the card, not the dots */}
                    <div className="relative w-full">
                        <div
                            ref={viewportRef}
                            className="w-full overflow-hidden py-5"
                        >
                            <motion.div
                                className="flex items-center"
                                style={{ gap: GAP_PX }}
                                animate={{
                                    x: centerPad - offset,
                                }}
                                transition={
                                    reduced || instant
                                        ? { duration: 0 }
                                        : {
                                              duration: 0.52,
                                              ease: EASE,
                                          }
                                }
                            >
                                {slides.map((leader, slideIndex) => {
                                    const active = slideIndex === trackIndex;
                                    const dist = Math.abs(
                                        slideIndex - trackIndex,
                                    );
                                    const introDelay =
                                        !introDone && inView && !reduced
                                            ? 0.35 + Math.min(dist, 3) * 0.1
                                            : 0;
                                    const shown = reduced || inView;

                                    return (
                                        <motion.div
                                            key={`${leader.id}-${slideIndex}`}
                                            className="min-h-[18.5rem] shrink-0 sm:min-h-[19.5rem] lg:min-h-[20.5rem]"
                                            style={{
                                                width:
                                                    cardWidth > 0
                                                        ? cardWidth
                                                        : 'min(64%, 920px)',
                                                zIndex: active ? 5 : 1,
                                            }}
                                            initial={
                                                reduced
                                                    ? false
                                                    : {
                                                          opacity: 0,
                                                          y: 32,
                                                          scale: 0.9,
                                                      }
                                            }
                                            animate={
                                                !shown
                                                    ? {
                                                          opacity: 0,
                                                          y: 32,
                                                          scale: 0.9,
                                                      }
                                                    : {
                                                          scale: active
                                                              ? 1.02
                                                              : 0.92,
                                                          opacity: active
                                                              ? 1
                                                              : 0.45,
                                                          y: active ? -4 : 0,
                                                      }
                                            }
                                            transition={{
                                                duration: reduced ? 0 : 0.5,
                                                ease: EASE,
                                                delay: introDelay,
                                            }}
                                        >
                                            <div
                                                className={cx(
                                                    'h-full rounded-2xl transition-shadow duration-500',
                                                    active
                                                        ? 'shadow-[0_28px_60px_-18px_rgba(10,20,51,0.45)]'
                                                        : 'shadow-none',
                                                )}
                                            >
                                                <LeaderCard
                                                    leader={leader}
                                                    t={t}
                                                    active={active}
                                                />
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        </div>

                        {/* Prev / Next — left & right edges of center card */}
                        {cardWidth > 0 ? (
                            <>
                                <motion.button
                                    type="button"
                                    onClick={() => go(-1)}
                                    aria-label={t('home.ourLeaders.prev')}
                                    className={cx(
                                        'absolute top-1/2 z-20 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full sm:size-11',
                                        'border border-navy-900/10 bg-white/95 text-navy-900 shadow-[0_8px_20px_-10px_rgba(10,20,51,0.5)] backdrop-blur-sm',
                                        'transition hover:border-navy-900/20 hover:bg-white',
                                        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                                    )}
                                    style={{ left: prevLeft }}
                                    initial={reduced ? false : { opacity: 0 }}
                                    animate={
                                        inView || reduced
                                            ? { opacity: 1 }
                                            : { opacity: 0 }
                                    }
                                    transition={{
                                        duration: reduced ? 0 : 0.4,
                                        delay: reduced || introDone ? 0 : 0.75,
                                        ease: EASE,
                                    }}
                                >
                                    <ChevronLeft
                                        className="size-5"
                                        aria-hidden="true"
                                    />
                                </motion.button>
                                <motion.button
                                    type="button"
                                    onClick={() => go(1)}
                                    aria-label={t('home.ourLeaders.next')}
                                    className={cx(
                                        'absolute top-1/2 z-20 flex size-10 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full sm:size-11',
                                        'border border-navy-900/10 bg-white/95 text-navy-900 shadow-[0_8px_20px_-10px_rgba(10,20,51,0.5)] backdrop-blur-sm',
                                        'transition hover:border-navy-900/20 hover:bg-white',
                                        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                                    )}
                                    style={{ left: nextLeft }}
                                    initial={reduced ? false : { opacity: 0 }}
                                    animate={
                                        inView || reduced
                                            ? { opacity: 1 }
                                            : { opacity: 0 }
                                    }
                                    transition={{
                                        duration: reduced ? 0 : 0.4,
                                        delay: reduced || introDone ? 0 : 0.75,
                                        ease: EASE,
                                    }}
                                >
                                    <ChevronRight
                                        className="size-5"
                                        aria-hidden="true"
                                    />
                                </motion.button>
                            </>
                        ) : null}
                    </div>

                    {/* Pagination dots */}
                    <motion.div
                        className="mt-8 flex items-center justify-center gap-2"
                        role="tablist"
                        aria-label={t('home.ourLeaders.title')}
                        initial={reduced ? false : { opacity: 0, y: 12 }}
                        animate={
                            inView || reduced
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: 12 }
                        }
                        transition={{
                            duration: reduced ? 0 : 0.45,
                            delay: reduced || introDone ? 0 : 0.8,
                            ease: EASE,
                        }}
                    >
                        {LEADERS.map((leader, dotIndex) => {
                            const selected = dotIndex === activeLogical;
                            return (
                                <button
                                    key={leader.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={selected}
                                    aria-label={`${t(leader.nameKey)}`}
                                    onClick={() => goTo(dotIndex)}
                                    className={cx(
                                        'rounded-full transition-all duration-300',
                                        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                                        selected
                                            ? 'h-2.5 w-6 bg-navy-900'
                                            : 'size-2.5 bg-navy-900/25 hover:bg-navy-900/40',
                                    )}
                                />
                            );
                        })}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
