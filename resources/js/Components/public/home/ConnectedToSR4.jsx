import { cx } from '@/lib/cx';
import {
    fadeUp,
    motionTransition,
    usePrefersReducedMotion,
} from '@/lib/usePrefersReducedMotion';
import { motion, useInView } from 'framer-motion';
import { useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * “Connected to SR4” — partners-style 2×5 logo grid on white.
 * Equal cards, centered brand mark (reference: redomedia partners strip).
 */

const EASE = [0.22, 1, 0.36, 1];

/** Matches Tailwind grid-cols: 2 → sm:3 → lg:5 */
function useSocialGridCols() {
    const [cols, setCols] = useState(2);

    useEffect(() => {
        const update = () => {
            const w = window.innerWidth;
            if (w >= 1024) {
                setCols(5);
            } else if (w >= 640) {
                setCols(3);
            } else {
                setCols(2);
            }
        };

        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    return cols;
}

function waveDelay(index, cols) {
    const row = Math.floor(index / cols);
    const col = index % cols;
    return 0.28 + row * 0.16 + col * 0.05;
}

const SOCIALS = [
    {
        id: 'facebook',
        labelKey: 'home.connected.items.facebook',
        href: 'https://www.facebook.com/',
        color: '#1877F2',
        Icon: FacebookIcon,
    },
    {
        id: 'youtube',
        labelKey: 'home.connected.items.youtube',
        href: 'https://www.youtube.com/',
        color: '#FF0000',
        Icon: YouTubeIcon,
    },
    {
        id: 'tiktok',
        labelKey: 'home.connected.items.tiktok',
        href: 'https://www.tiktok.com/',
        color: '#111111',
        Icon: TikTokIcon,
    },
    {
        id: 'viber',
        labelKey: 'home.connected.items.viber',
        href: 'https://www.viber.com/',
        color: '#7360F2',
        Icon: ViberIcon,
    },
    {
        id: 'telegram',
        labelKey: 'home.connected.items.telegram',
        href: 'https://telegram.org/',
        color: '#26A5E4',
        Icon: TelegramIcon,
    },
    {
        id: 'whatsapp',
        labelKey: 'home.connected.items.whatsapp',
        href: 'https://www.whatsapp.com/',
        color: '#25D366',
        Icon: WhatsAppIcon,
    },
    {
        id: 'douyin',
        labelKey: 'home.connected.items.douyin',
        href: 'https://www.douyin.com/',
        color: '#111111',
        Icon: DouyinIcon,
    },
    {
        id: 'kuaishou',
        labelKey: 'home.connected.items.kuaishou',
        href: 'https://www.kuaishou.com/',
        color: '#FF4906',
        Icon: KuaishouIcon,
    },
    {
        id: 'wechat',
        labelKey: 'home.connected.items.wechat',
        href: 'https://www.wechat.com/',
        color: '#07C160',
        Icon: WeChatIcon,
    },
    {
        id: 'mongla',
        labelKey: 'home.connected.items.mongla',
        href: 'https://www.facebook.com/',
        color: '#0A1433',
        Icon: NewsIcon,
    },
];

function FacebookIcon({ className }) {
    return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
            <path
                fill="currentColor"
                d="M14 8h2V5h-2c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.1l.9-3H13V9c0-.6.4-1 1-1z"
            />
        </svg>
    );
}

function YouTubeIcon({ className }) {
    return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
            <path
                fill="currentColor"
                d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.8 15.5v-7l6.2 3.5-6.2 3.5z"
            />
        </svg>
    );
}

function TikTokIcon({ className }) {
    return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
            <path
                fill="currentColor"
                d="M19.6 8.2a5.8 5.8 0 0 1-3.4-1.1v7.2a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .9.1v2.8a2.8 2.8 0 1 0 2 2.7V2.5h2.7a5.8 5.8 0 0 0 3.4 3.4v2.3z"
            />
        </svg>
    );
}

function ViberIcon({ className }) {
    return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
            <path
                fill="currentColor"
                d="M11.4 2C6.1 2.3 2.2 6.5 2 11.7c-.1 2.6.8 5 2.3 6.9l-.8 3 3.2-.8a9.6 9.6 0 0 0 5.1 1.4h.1c5.4-.1 9.8-4.5 9.9-9.9C22 5.8 17.2 1.7 11.4 2zm4.9 13.3c-.2.6-1.2 1.1-2 1.2-.5.1-1.2.2-3.5-.7-2.8-1.2-4.6-4-4.7-4.2-.2-.2-1.2-1.6-1.2-3s.8-2.1 1-2.3c.3-.2.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.3.2.5 0 .8l-.4.6c-.2.2-.4.4-.2.8.2.3.9 1.4 1.9 2.3 1.3 1.1 2.4 1.5 2.7 1.7.4.1.6.1.8-.1l.7-.8c.2-.3.5-.2.8-.1l2.2 1c.3.2.5.2.6.4.1.3 0 1.2-.3 1.8z"
            />
        </svg>
    );
}

function TelegramIcon({ className }) {
    return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
            <path
                fill="currentColor"
                d="M21.9 4.2 2.8 11.5c-1.3.5-1.3 1.2-.2 1.5l4.7 1.5 1.8 5.5c.2.7.1.9.8.9.5 0 .7-.2 1-.5l2.3-2.2 4.8 3.5c.9.5 1.5.2 1.7-.8L22.9 5.5c.3-1.2-.4-1.7-1-1.3zM9.3 14.6l-.2 3.2-1.1-3.7 9.5-6-8.2 6.5z"
            />
        </svg>
    );
}

function WhatsAppIcon({ className }) {
    return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
            <path
                fill="currentColor"
                d="M12 2a10 10 0 0 0-8.6 15l-1.1 4 4.1-1.1A10 10 0 1 0 12 2zm5.7 14.3c-.2.7-1.3 1.2-2.1 1.4-.6.1-1.3.2-3.8-.8-3-1.2-5-4.2-5.1-4.4-.2-.2-1.3-1.7-1.3-3.3 0-1.5.8-2.3 1.1-2.6.3-.3.6-.3.9-.3h.6c.2 0 .4 0 .6.5l.9 2.2c.1.3 0 .5-.1.7l-.5.7c-.2.2-.3.4-.1.7.2.4 1 1.6 2.1 2.5 1.4 1.2 2.5 1.6 2.9 1.8.3.1.5.1.7-.1l.7-.9c.2-.2.4-.2.7-.1l2.3 1.1c.3.1.5.2.6.3.1.3 0 1.1-.3 1.7z"
            />
        </svg>
    );
}

function DouyinIcon({ className }) {
    return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
            <path
                fill="currentColor"
                d="M14.2 3v10.1a3.7 3.7 0 1 1-2.5-3.5V6.2A6.5 6.5 0 0 0 8 7.1V9a4.3 4.3 0 0 1 1.7-.3 4.2 4.2 0 1 0 4.2 4.2V8.4A7.8 7.8 0 0 0 19 10V7.3a7.8 7.8 0 0 1-4.8-4.3H14.2z"
            />
        </svg>
    );
}

function KuaishouIcon({ className }) {
    return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
            <path
                fill="currentColor"
                d="M7.2 3.5h3.1l3.2 5.6 3.3-5.6h3.2l-4.9 8.1 5.2 8.9h-3.3l-3.5-6.1-3.5 6.1H6.7l5.2-8.9-4.7-8.1z"
            />
        </svg>
    );
}

function WeChatIcon({ className }) {
    return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
            <path
                fill="currentColor"
                d="M9.5 4C5.9 4 3 6.5 3 9.6c0 1.8 1 3.4 2.5 4.4L5 16.5l2.3-.8c.7.2 1.4.3 2.2.3.2 0 .4 0 .6 0A4.7 4.7 0 0 1 9.5 15c-2.9 0-5.3-2-5.3-4.5S6.6 6 9.5 6c2.5 0 4.5 1.5 5 3.5.7-.2 1.4-.3 2.2-.3C19.4 9.2 22 11.5 22 14.3c0 2.8-2.6 5.1-5.8 5.1-.7 0-1.4-.1-2.1-.3l-2.5.9.6-2.1c-1.3-.9-2.1-2.2-2.1-3.7 0-.2 0-.4.1-.5-.2 0-.4 0-.7 0zm-2 4.2a.9.9 0 1 0 0 1.8.9.9 0 0 0 0-1.8zm4.2 0a.9.9 0 1 0 0 1.8.9.9 0 0 0 0-1.8zM14 12.5a.8.8 0 1 0 0 1.6.8.8 0 0 0 0-1.6zm3.5 0a.8.8 0 1 0 0 1.6.8.8 0 0 0 0-1.6z"
            />
        </svg>
    );
}

function NewsIcon({ className }) {
    return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
            <path
                fill="currentColor"
                d="M4 5h12a2 2 0 0 1 2 2v11H6a2 2 0 0 1-2-2V5zm14 3h2a2 2 0 0 1 2 2v7a3 3 0 0 1-3 3H6.5c.3-.3.5-.7.5-1.1V8h11V8zM7 9v2h8V9H7zm0 4v2h5v-2H7z"
            />
        </svg>
    );
}

export default function ConnectedToSR4() {
    const { t } = useTranslation();
    const labelId = useId();
    const reduced = usePrefersReducedMotion();
    const sectionRef = useRef(null);
    const inView = useInView(sectionRef, { once: false, amount: 0.25 });
    const cols = useSocialGridCols();
    const shown = reduced || inView;

    return (
        <section
            ref={sectionRef}
            data-testid="home-connected-sr4"
            className="relative overflow-hidden bg-[#fafafa] py-8 sm:py-12 lg:py-14"
            aria-labelledby={labelId}
        >
            <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-navy-900/12 to-transparent"
                aria-hidden="true"
            />

            <div className="relative mx-auto w-full max-w-[1680px] px-4 sm:px-6 lg:px-8">
                <motion.header
                    className="mx-auto max-w-2xl text-center"
                    initial={reduced ? false : 'hidden'}
                    animate={shown ? 'show' : 'hidden'}
                    variants={fadeUp}
                    transition={motionTransition(reduced, 0.55)}
                >
                    <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-navy-900/45 sm:text-xs">
                        {t('home.connected.eyebrow')}
                    </p>
                    <h2
                        id={labelId}
                        className="mt-3 font-display text-2xl font-normal tracking-tight text-navy-900 sm:text-[1.75rem]"
                    >
                        {t('home.connected.title')}
                    </h2>
                    <span
                        className="mx-auto mt-4 block h-px w-12 bg-accent/70"
                        aria-hidden="true"
                    />
                    <p className="mt-4 text-sm leading-6 text-[#6b6b6b] sm:text-base">
                        {t('home.connected.lead')}
                    </p>
                </motion.header>

                <ul
                    className={cx(
                        'mt-6 grid list-none sm:mt-8',
                        'grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3',
                        'lg:grid-cols-5 lg:grid-rows-2 lg:gap-3.5',
                    )}
                >
                    {SOCIALS.map(
                        ({ id, labelKey, href, color, Icon }, index) => (
                            <motion.li
                                key={id}
                                className="min-w-0"
                                initial={
                                    reduced
                                        ? false
                                        : { opacity: 0, y: 22 }
                                }
                                animate={
                                    shown
                                        ? { opacity: 1, y: 0 }
                                        : { opacity: 0, y: 22 }
                                }
                                transition={{
                                    duration: reduced ? 0 : 0.45,
                                    ease: EASE,
                                    delay: reduced
                                        ? 0
                                        : shown
                                          ? waveDelay(index, cols)
                                          : 0,
                                }}
                            >
                                <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={t(labelKey)}
                                    className={cx(
                                        'group relative flex h-[5.25rem] w-full flex-col items-center justify-center gap-2 sm:h-[5.75rem] sm:gap-2.5',
                                        'overflow-hidden rounded-xl border border-[#e8e8e8] bg-white',
                                        'px-2 sm:px-3',
                                        'transition duration-300 ease-out',
                                        'hover:-translate-y-0.5 hover:border-navy-900/15',
                                        'hover:shadow-[0_14px_28px_-18px_rgba(10,20,51,0.35)]',
                                        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                                    )}
                                >
                                    <span
                                        className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
                                        style={{
                                            background: `radial-gradient(circle at 50% 28%, ${color}18 0%, transparent 68%)`,
                                        }}
                                        aria-hidden="true"
                                    />

                                    <span
                                        className={cx(
                                            'relative inline-flex size-8 shrink-0 items-center justify-center rounded-lg sm:size-9',
                                            'bg-[#f7f8fa]',
                                            'transition duration-300 group-hover:scale-105 group-hover:bg-white',
                                        )}
                                        style={{ color }}
                                    >
                                        <Icon className="size-4 sm:size-[1.125rem]" />
                                    </span>

                                    <span className="relative max-w-full truncate px-0.5 text-center text-[0.7rem] font-medium tracking-tight text-navy-950/70 transition group-hover:text-navy-950 sm:text-xs">
                                        {t(labelKey)}
                                    </span>
                                </a>
                            </motion.li>
                        ),
                    )}
                </ul>
            </div>
        </section>
    );
}
