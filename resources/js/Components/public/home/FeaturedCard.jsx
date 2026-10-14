import { cx } from '@/lib/cx';
import { localizedHref } from '@/lib/navigation';
import { useCanAutoplayVideo } from '@/lib/useCanAutoplayVideo';
import {
    motionTransition,
    usePrefersReducedMotion,
} from '@/lib/usePrefersReducedMotion';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import FadeIn from './FadeIn';

export default function FeaturedCard({ card, index }) {
    const { t } = useTranslation();
    const locale = usePage().props.locale ?? 'my';
    const reduced = usePrefersReducedMotion();
    const hoverVideoOk = useCanAutoplayVideo({ deferUntilPaint: false });
    const videoRef = useRef(null);

    const play = () => {
        if (!hoverVideoOk || reduced) {
            return;
        }

        const video = videoRef.current;

        if (!video) {
            return;
        }

        video.play().catch(() => {});
    };

    const pause = () => {
        const video = videoRef.current;

        if (!video) {
            return;
        }

        video.pause();
        video.currentTime = 0;
    };

    return (
        <FadeIn delay={index}>
            <motion.div
                whileHover={
                    reduced
                        ? undefined
                        : { y: -4, transition: motionTransition(false, 0.35) }
                }
                className="h-full"
            >
                <Link
                    href={localizedHref(locale, card.href)}
                    className={cx(
                        'group relative block h-full min-h-[18rem] overflow-hidden bg-navy-900 text-white',
                        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                    )}
                    onMouseEnter={play}
                    onMouseLeave={pause}
                    onFocus={play}
                    onBlur={pause}
                >
                    <img
                        src={card.poster}
                        alt=""
                        width={card.width}
                        height={card.height}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                    {hoverVideoOk ? (
                        <video
                            ref={videoRef}
                            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:hidden"
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            poster={card.poster}
                            width={card.width}
                            height={card.height}
                            aria-hidden="true"
                            tabIndex={-1}
                        >
                            <source src={card.video} type="video/mp4" />
                        </video>
                    ) : null}
                    <div
                        className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/45 to-navy-900/15"
                        aria-hidden="true"
                    />
                    <div className="relative flex h-full min-h-[18rem] flex-col justify-end p-6 sm:p-7">
                        <h3 className="font-display text-2xl font-medium tracking-tight">
                            {t(card.titleKey)}
                        </h3>
                        <span
                            className="mt-3 block h-px w-10 bg-accent"
                            aria-hidden="true"
                        />
                        <p className="mt-3 text-sm leading-6 text-white/85">
                            {t(card.bodyKey)}
                        </p>
                    </div>
                </Link>
            </motion.div>
        </FadeIn>
    );
}
