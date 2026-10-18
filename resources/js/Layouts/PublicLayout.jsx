import DesktopNav from '@/Components/public/DesktopNav';
import SubmenuTabs from '@/Components/public/SubmenuTabs';
import LanguageSwitcher from '@/Components/public/LanguageSwitcher';
import MobileNav from '@/Components/public/MobileNav';
import SearchControl from '@/Components/public/SearchControl';
import SiteFooter from '@/Components/public/SiteFooter';
import TopMarquee from '@/Components/public/TopMarquee';
import { cx } from '@/lib/cx';
import { localizedHref } from '@/lib/navigation';
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion';
import { Head, Link, usePage } from '@inertiajs/react';
import { MotionConfig } from 'framer-motion';
import { Menu } from 'lucide-react';
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

function SiteHeader({
    headerRef,
    immersive,
    showPrimary,
    condensed,
    direction,
    drawerOpen,
    drawerId,
    setDrawerOpen,
    locale,
    t,
}) {
    return (
        <header
            ref={headerRef}
            data-testid="site-header"
            data-condensed={condensed ? 'true' : 'false'}
            data-direction={direction}
            className={cx(
                'sticky top-0 z-40 overflow-anchor-none transition-colors duration-300',
                immersive
                    ? 'bg-gradient-to-b from-navy-950/55 to-navy-950/0 text-white hover:bg-primary hover:bg-none'
                    : 'border-b border-border bg-surface/95 text-text shadow-sm backdrop-blur-md',
            )}
        >
            <TopMarquee />
            <div
                className={cx(
                    'relative mx-auto flex w-full max-w-content items-center gap-3 px-4 sm:px-6',
                    showPrimary ? 'min-h-[4.75rem]' : 'min-h-16',
                )}
            >
                <button
                    type="button"
                    className={cx(
                        'inline-flex min-h-11 items-center gap-2 rounded-md px-1 text-xs font-medium uppercase tracking-[0.16em] lg:hidden',
                        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                        immersive ? 'hover:bg-white/10' : 'hover:bg-text/5',
                    )}
                    aria-label={drawerOpen ? t('nav.closeMenu') : t('nav.openMenu')}
                    aria-expanded={drawerOpen}
                    aria-controls={drawerOpen ? drawerId : undefined}
                    onClick={() => setDrawerOpen((current) => !current)}
                >
                    <Menu className="size-5" aria-hidden="true" />
                    <span className="hidden sm:inline">{t('nav.openMenu')}</span>
                </button>
                <Link
                    href={localizedHref(locale, '/')}
                    className={cx(
                        'absolute left-1/2 inline-flex min-h-11 -translate-x-1/2 items-center',
                        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                    )}
                >
                    <img
                        src="/images/logo.png"
                        alt={t('common.appName')}
                        width={1227}
                        height={1282}
                        className="h-14 w-auto sm:h-16"
                    />
                </Link>
                <div className="ms-auto flex items-center gap-2">
                    <SearchControl tone={immersive ? 'inverse' : 'default'} />
                    <LanguageSwitcher
                        tone={immersive ? 'inverse' : 'default'}
                    />
                </div>
            </div>
            <div
                className={cx(
                    'hidden overflow-hidden transition-[max-height,opacity] duration-300 lg:block',
                    showPrimary
                        ? 'max-h-40 opacity-100'
                        : 'pointer-events-none max-h-0 opacity-0',
                )}
                inert={showPrimary ? undefined : true}
            >
                <DesktopNav
                    className="w-full justify-center"
                    tone={immersive ? 'inverse' : 'default'}
                />
            </div>
            {!immersive ? <SubmenuTabs /> : null}
        </header>
    );
}

export default function PublicLayout({ children }) {
    const { t } = useTranslation();
    const reduced = usePrefersReducedMotion();
    const { url, props } = usePage();
    const { seo = {}, locale = 'my' } = props;
    const alternates = seo.alternates ?? {};
    const ogLocale = locale === 'zh' ? 'zh_Hans' : locale;
    const drawerId = useId();
    const headerRef = useRef(null);
    const lastScrollY = useRef(0);
    const directionRef = useRef('up');
    const upwardRef = useRef(0);
    const [chromeHeight, setChromeHeight] = useState(0);
    const [direction, setDirection] = useState('up');
    const [condensed, setCondensed] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const closeDrawer = useCallback(() => setDrawerOpen(false), []);
    const isHome = /^\/(|en|zh|my)\/?$/.test(url.split('?')[0]);
    const [immersive, setImmersive] = useState(isHome);
    const showPrimary = !condensed || direction === 'up' || drawerOpen;

    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY;
            const delta = y - lastScrollY.current;

            if (delta > 5) {
                upwardRef.current = 0;

                if (directionRef.current !== 'down') {
                    directionRef.current = 'down';
                    setDirection('down');
                }
            } else if (delta < -5) {
                upwardRef.current += delta;

                if (
                    upwardRef.current < -24 &&
                    directionRef.current !== 'up'
                ) {
                    directionRef.current = 'up';
                    upwardRef.current = 0;
                    setDirection('up');
                }
            }

            lastScrollY.current = y;

            const hero = document.querySelector('[data-immersive-hero]');
            const header = headerRef.current;
            const cover = document.querySelector('[data-testid=home-about-shan]');
            const nextImmersive = Boolean(
                hero &&
                    header &&
                    (cover
                        ? cover.getBoundingClientRect().top >
                          header.offsetHeight + 8
                        : hero.getBoundingClientRect().bottom >
                          header.offsetHeight + 8),
            );
            setImmersive((current) =>
                current === nextImmersive ? current : nextImmersive,
            );
            setCondensed((current) => {
                if (!current && y >= 80) {
                    return true;
                }

                if (current && y < 60) {
                    return false;
                }

                return current;
            });
        };

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useLayoutEffect(() => {
        const measure = () => {
            if (window.scrollY > 0) {
                return;
            }

            const header = headerRef.current?.offsetHeight ?? 0;
            setChromeHeight(header);
        };

        measure();
        const observer = new ResizeObserver(measure);

        if (headerRef.current) {
            observer.observe(headerRef.current);
        }

        return () => observer.disconnect();
    }, [url, showPrimary]);

    useEffect(() => {
        setDrawerOpen(false);
    }, [url]);

    useEffect(() => {
        const root = document.documentElement;
        const previous = root.style.overflowAnchor;
        root.style.overflowAnchor = 'none';

        return () => {
            root.style.overflowAnchor = previous;
        };
    }, []);

    return (
        <MotionConfig reducedMotion={reduced ? 'always' : 'user'}>
            <div className="min-h-screen bg-bg text-text">
                <Head>
                    <meta
                        head-key="og:type"
                        property="og:type"
                        content="website"
                    />
                    <meta
                        head-key="og:site_name"
                        property="og:site_name"
                        content={t('common.appName')}
                    />
                    <meta
                        head-key="og:locale"
                        property="og:locale"
                        content={ogLocale}
                    />
                    {seo.url ? (
                        <meta
                            head-key="og:url"
                            property="og:url"
                            content={seo.url}
                        />
                    ) : null}
                    <meta
                        head-key="description"
                        name="description"
                        content={t('seo.defaultDescription')}
                    />
                    <meta
                        head-key="og:description"
                        property="og:description"
                        content={t('seo.defaultDescription')}
                    />
                    {Object.entries(alternates).map(([code, href]) => (
                        <link
                            key={code}
                            head-key={`hreflang-${code}`}
                            rel="alternate"
                            hrefLang={code === 'zh' ? 'zh-Hans' : code}
                            href={href}
                        />
                    ))}
                    {alternates.my ? (
                        <link
                            head-key="hreflang-x-default"
                            rel="alternate"
                            hrefLang="x-default"
                            href={alternates.my}
                        />
                    ) : null}
                </Head>
                <a
                    href="#main"
                    className={cx(
                        'fixed start-4 top-4 z-50 inline-flex min-h-11 -translate-y-[150%] items-center bg-primary px-4 text-sm font-medium text-on-primary',
                        'focus:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                    )}
                >
                    {t('common.skipToContent')}
                </a>

                <div
                    id="public-shell"
                    style={{ '--site-chrome': `${chromeHeight}px` }}
                >
                    <SiteHeader
                        headerRef={headerRef}
                        immersive={immersive}
                        showPrimary={showPrimary}
                        condensed={condensed}
                        direction={direction}
                        drawerOpen={drawerOpen}
                        drawerId={drawerId}
                        setDrawerOpen={setDrawerOpen}
                        locale={locale}
                        t={t}
                    />

                    <main id="main" tabIndex={-1} className="outline-none">
                        {children}
                    </main>
                    <SiteFooter />
                </div>

                <MobileNav
                    id={drawerId}
                    open={drawerOpen}
                    onClose={closeDrawer}
                />
            </div>
        </MotionConfig>
    );
}
