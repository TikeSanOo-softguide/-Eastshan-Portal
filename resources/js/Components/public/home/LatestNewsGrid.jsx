import { cx } from '@/lib/cx';
import { localizedHref } from '@/lib/navigation';
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion';
import { Link, usePage } from '@inertiajs/react';
import { motion, useInView } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

/** Local copies of DVB story images (attribution: DVB). */
const NEWS_IMAGES = [
    '/images/news/dvb-1.jpg',
    '/images/news/dvb-2.jpg',
    '/images/news/dvb-3.jpg',
    '/images/news/dvb-4.jpg',
    '/images/news/dvb-5.jpg',
];

const EASE = [0.22, 1, 0.36, 1];

/** Fan offsets while stacked at center (all remain visible). */
const STACK = [
    { ox: -28, oy: -18, rotate: -8, scale: 0.88, z: 14 },
    { ox: -10, oy: -6, rotate: -3, scale: 0.92, z: 16 },
    { ox: 0, oy: 0, rotate: 0, scale: 0.96, z: 18 },
    { ox: 12, oy: 8, rotate: 3.5, scale: 0.92, z: 20 },
    { ox: 28, oy: 16, rotate: 8, scale: 0.88, z: 22 },
];

const CELL_CLASS = [
    // Main — left, full height on md+
    'col-span-2 min-h-[16rem] md:col-span-1 md:row-span-2 md:min-h-0',
    // Right 2×2
    'min-h-[9.5rem] md:min-h-0',
    'min-h-[9.5rem] md:min-h-0',
    'min-h-[9.5rem] md:min-h-0',
    'min-h-[9.5rem] md:min-h-0',
];

function newsImage(item, index) {
    if (item?.image) {
        return item.image;
    }

    return NEWS_IMAGES[index % NEWS_IMAGES.length];
}

function NewsCard({
    item,
    index,
    featured = false,
    locale,
    className = '',
}) {
    return (
        <Link
            href={localizedHref(locale, item.href || '/news')}
            className={cx(
                'group relative block h-full w-full overflow-hidden rounded-[12px] bg-navy-900',
                'shadow-[0_18px_50px_-20px_rgba(10,20,51,0.55)]',
                'ring-1 ring-black/10',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                className,
            )}
        >
            <img
                src={newsImage(item, index)}
                alt=""
                width={featured ? 1600 : 900}
                height={featured ? 1200 : 700}
                loading={featured ? 'eager' : 'lazy'}
                decoding="async"
                className="absolute inset-0 h-full w-full rounded-[12px] object-cover transition duration-500 group-hover:scale-[1.03]"
            />
            <div
                className={cx(
                    'pointer-events-none absolute inset-0',
                    featured
                        ? 'bg-gradient-to-t from-navy-950/92 via-navy-950/25 to-transparent'
                        : 'bg-gradient-to-t from-navy-950/90 via-navy-950/18 to-transparent',
                )}
                aria-hidden="true"
            />
            <div
                className={cx(
                    'absolute inset-x-0 bottom-0',
                    featured ? 'p-5 sm:p-7 lg:p-8' : 'p-3 sm:p-4',
                )}
            >
                {featured ? (
                    <span
                        className="mb-3 block h-0.5 w-12 bg-gold-500"
                        aria-hidden="true"
                    />
                ) : null}
                <h3
                    className={cx(
                        'font-display font-medium leading-snug text-white [html[lang=my]_&]:leading-[1.55]',
                        featured
                            ? 'max-w-lg text-xl sm:text-2xl lg:text-3xl line-clamp-3'
                            : 'text-sm sm:text-base line-clamp-2',
                    )}
                >
                    {item.title}
                </h3>
            </div>
        </Link>
    );
}

function StaticNewsGrid({ items, locale }) {
    const featured = items[0];
    const gridItems = items.slice(1, 5);

    return (
        <div
            className={cx(
                'mx-auto grid w-full gap-3 p-3 sm:gap-4 sm:p-5 lg:gap-5 lg:p-6',
                'grid-cols-2 md:h-[min(64vh,36rem)] md:grid-cols-[2fr_0.95fr_0.95fr] md:grid-rows-2',
            )}
        >
            <div className="col-span-2 min-h-[16rem] md:col-span-1 md:row-span-2 md:min-h-0">
                <NewsCard item={featured} index={0} featured locale={locale} />
            </div>
            {Array.from({ length: 4 }).map((_, index) => {
                const item = gridItems[index];
                if (!item) {
                    return (
                        <div
                            key={`empty-${index}`}
                            className="min-h-[9.5rem] rounded-[12px] bg-navy-50 md:min-h-0"
                            aria-hidden="true"
                        />
                    );
                }
                return (
                    <div key={item.id} className="min-h-[9.5rem] md:min-h-0">
                        <NewsCard
                            item={item}
                            index={index + 1}
                            locale={locale}
                        />
                    </div>
                );
            })}
        </div>
    );
}

/**
 * Cards sit in a real CSS grid (main + 2×2) so they never overlap when settled.
 * Before/while entering view they translate to the stage center as a visible stack.
 */
function SpreadTile({
    item,
    index,
    locale,
    featured,
    spread,
    stack,
    offset,
}) {
    return (
        <motion.div
            className="h-full w-full will-change-transform"
            style={{
                position: 'relative',
                zIndex: spread ? 1 : stack.z,
                opacity: 1,
            }}
            initial={false}
            animate={
                spread
                    ? { x: 0, y: 0, rotate: 0, scale: 1 }
                    : {
                          x: offset.x,
                          y: offset.y,
                          rotate: stack.rotate,
                          scale: stack.scale,
                      }
            }
            transition={{
                duration: 0.85,
                delay: spread ? index * 0.09 : (4 - index) * 0.04,
                ease: EASE,
            }}
        >
            <NewsCard
                item={item}
                index={index}
                featured={featured}
                locale={locale}
            />
        </motion.div>
    );
}

function SpreadNewsGrid({ items, locale }) {
    const sectionRef = useRef(null);
    const gridRef = useRef(null);
    const cellRefs = useRef([]);
    const isInView = useInView(sectionRef, {
        once: false,
        amount: 0.35,
    });
    const [spread, setSpread] = useState(false);
    const [offsets, setOffsets] = useState(() =>
        STACK.map((s) => ({ x: s.ox, y: s.oy })),
    );

    const tiles = items.slice(0, 5);

    const measureOffsets = () => {
        const grid = gridRef.current;
        if (!grid) {
            return;
        }

        const gridBox = grid.getBoundingClientRect();
        const cx = gridBox.left + gridBox.width / 2;
        const cy = gridBox.top + gridBox.height / 2;

        setOffsets(
            STACK.map((stack, index) => {
                const cell = cellRefs.current[index];
                if (!cell) {
                    return { x: stack.ox, y: stack.oy };
                }

                const box = cell.getBoundingClientRect();
                const cellCx = box.left + box.width / 2;
                const cellCy = box.top + box.height / 2;

                return {
                    x: cx - cellCx + stack.ox,
                    y: cy - cellCy + stack.oy,
                };
            }),
        );
    };

    useLayoutEffect(() => {
        measureOffsets();

        const grid = gridRef.current;
        if (!grid || typeof ResizeObserver === 'undefined') {
            return undefined;
        }

        const ro = new ResizeObserver(() => measureOffsets());
        ro.observe(grid);
        window.addEventListener('resize', measureOffsets);
        return () => {
            ro.disconnect();
            window.removeEventListener('resize', measureOffsets);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tiles.length]);

    useEffect(() => {
        if (!isInView) {
            setSpread(false);
            return undefined;
        }

        measureOffsets();
        setSpread(false);
        const timer = window.setTimeout(() => setSpread(true), 140);
        return () => window.clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isInView]);

    return (
        <div
            ref={sectionRef}
            className="relative mx-auto w-full max-w-[1680px]"
        >
            <div
                ref={gridRef}
                className={cx(
                    'mx-auto grid w-full gap-3 p-3 sm:gap-4 sm:p-5 lg:gap-5 lg:p-6',
                    'grid-cols-2 md:h-[min(64vh,36rem)] md:grid-cols-[2fr_0.95fr_0.95fr] md:grid-rows-2',
                )}
            >
                {tiles.map((item, index) => {
                    const stack = STACK[index];
                    const offset = offsets[index] ?? { x: 0, y: 0 };

                    return (
                        <div
                            key={item.id}
                            ref={(node) => {
                                cellRefs.current[index] = node;
                            }}
                            className={CELL_CLASS[index]}
                        >
                            <SpreadTile
                                item={item}
                                index={index}
                                locale={locale}
                                featured={index === 0}
                                spread={spread}
                                stack={stack}
                                offset={offset}
                            />
                        </div>
                    );
                })}

                {tiles.length < 5
                    ? Array.from({ length: 5 - tiles.length }).map(
                          (_, emptyIndex) => (
                              <div
                                  key={`empty-${emptyIndex}`}
                                  className="min-h-[9.5rem] rounded-[12px] bg-navy-50 md:min-h-0"
                                  aria-hidden="true"
                              />
                          ),
                      )
                    : null}
            </div>
        </div>
    );
}

export default function LatestNewsGrid({ news = [] }) {
    const { t } = useTranslation();
    const locale = usePage().props.locale ?? 'my';
    const reduced = usePrefersReducedMotion();

    const items = news.slice(0, 5);
    const featured = items[0] ?? null;

    return (
        <section
            data-testid="home-latest-news"
            className="relative z-10 w-full overflow-x-clip bg-white"
            aria-label={t('home.news.title')}
        >
            <h2 className="sr-only">{t('home.news.title')}</h2>

            {!featured ? (
                <p className="px-6 py-12 text-sm text-muted">
                    {t('home.news.empty')}
                </p>
            ) : reduced ? (
                <StaticNewsGrid items={items} locale={locale} />
            ) : (
                <SpreadNewsGrid items={items} locale={locale} />
            )}
        </section>
    );
}
