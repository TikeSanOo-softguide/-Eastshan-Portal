import { cx } from '@/lib/cx';
import { localizedHref } from '@/lib/navigation';
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion';
import { Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

const items = [
    { key: 'nav.marquee.news', href: '/news' },
    { key: 'nav.marquee.institutions', href: '/institutions' },
    { key: 'nav.marquee.services', href: '/infrastructure/education' },
    { key: 'nav.marquee.heritage', href: '/heritage' },
    { key: 'nav.marquee.contact', href: '/contact' },
];

function MarqueeTrack({ locale, t, ariaHidden = false }) {
    return (
        <ul
            className="flex shrink-0 items-center gap-10 px-5"
            aria-hidden={ariaHidden || undefined}
        >
            {items.map((item) => (
                <li key={item.key} className="shrink-0">
                    <Link
                        href={localizedHref(locale, item.href)}
                        className={cx(
                            'inline-flex items-center gap-3 whitespace-nowrap text-[11px] font-normal uppercase tracking-[0.18em] text-white/90',
                            'transition-colors hover:text-gold-300',
                            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                        )}
                        tabIndex={ariaHidden ? -1 : undefined}
                    >
                        <span
                            className="size-1 shrink-0 rounded-full bg-gold-500"
                            aria-hidden="true"
                        />
                        {t(item.key)}
                    </Link>
                </li>
            ))}
        </ul>
    );
}

export default function TopMarquee() {
    const { t } = useTranslation();
    const locale = usePage().props.locale ?? 'my';
    const reduced = usePrefersReducedMotion();

    return (
        <div
            data-testid="top-marquee"
            className="border-b border-white/10 bg-navy-900 text-white"
            role="region"
            aria-label={t('nav.marquee.label')}
        >
            <div className="relative overflow-hidden py-2">
                {reduced ? (
                    <div className="mx-auto flex max-w-content flex-wrap items-center justify-center gap-x-8 gap-y-1 px-4 sm:px-6">
                        {items.map((item) => (
                            <Link
                                key={item.key}
                                href={localizedHref(locale, item.href)}
                                className="inline-flex items-center gap-2 text-[11px] font-normal uppercase tracking-[0.18em] text-white/90 hover:text-gold-300"
                            >
                                <span
                                    className="size-1 rounded-full bg-gold-500"
                                    aria-hidden="true"
                                />
                                {t(item.key)}
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
                        <MarqueeTrack locale={locale} t={t} />
                        <MarqueeTrack locale={locale} t={t} ariaHidden />
                    </div>
                )}
            </div>
        </div>
    );
}
