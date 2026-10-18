import { cx } from '@/lib/cx';
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion';
import {
    motion,
    useScroll,
    useSpring,
    useTransform,
} from 'framer-motion';
import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const paragraphs = ['p1', 'p2', 'p3', 'p4'];

/** Dim → lit opacity (Redo Media style). Background stays white. */
const DIM = 0.22;
const LIT = 1;

function splitTokens(text) {
    return text.split(/(\s+)/).filter((part) => part.length > 0);
}

function RevealWord({ children, progress, index, total }) {
    const start = total <= 1 ? 0 : index / total;
    const end = Math.min(1, start + Math.max(0.08, 1.15 / total));
    const opacity = useTransform(progress, [start, end], [DIM, LIT]);

    return (
        <motion.span style={{ opacity }} className="will-change-[opacity]">
            {children}
        </motion.span>
    );
}

function ScrollRevealParagraph({ text, className }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start 0.92', 'end 0.38'],
    });
    const progress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 28,
        mass: 0.4,
        restDelta: 0.001,
    });

    const tokens = useMemo(() => splitTokens(text), [text]);
    const wordCount = useMemo(
        () => tokens.filter((part) => !/^\s+$/.test(part)).length,
        [tokens],
    );

    let wordIndex = 0;

    return (
        <p ref={ref} className={className}>
            {tokens.map((part, i) => {
                if (/^\s+$/.test(part)) {
                    return <span key={`s-${i}`}>{part}</span>;
                }

                const index = wordIndex;
                wordIndex += 1;

                return (
                    <RevealWord
                        key={`w-${i}`}
                        progress={progress}
                        index={index}
                        total={wordCount}
                    >
                        {part}
                    </RevealWord>
                );
            })}
        </p>
    );
}

function ScrollRevealLine({ text, className, id, as: Tag = 'p' }) {
    const ref = useRef(null);
    const MotionTag = motion[Tag] ?? motion.p;
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start 0.95', 'end 0.55'],
    });
    const progress = useSpring(scrollYProgress, {
        stiffness: 110,
        damping: 30,
        mass: 0.35,
    });
    const opacity = useTransform(progress, [0, 0.65], [DIM, LIT]);

    return (
        <MotionTag
            ref={ref}
            id={id}
            style={{ opacity }}
            className={cx(className, 'will-change-[opacity]')}
        >
            {text}
        </MotionTag>
    );
}

export default function AboutShanState() {
    const { t } = useTranslation();
    const reduced = usePrefersReducedMotion();

    const bodyClass =
        'text-justify text-[15px] font-normal leading-7 text-[#293340] [html[lang=my]_&]:text-start [html[lang=my]_&]:text-base [html[lang=my]_&]:leading-[1.85] sm:text-base sm:leading-7';

    return (
        <section
            id="about-shan-state"
            data-testid="home-about-shan"
            className="bg-white px-6 py-8 sm:px-10 sm:py-12 lg:py-14"
            aria-labelledby="about-shan-heading"
        >
            <div className="mx-auto w-full max-w-[782px]">
                {reduced ? (
                    <h2
                        id="about-shan-heading"
                        className="mb-10 text-center font-display text-2xl font-normal tracking-tight text-navy-900 sm:mb-12 sm:text-[1.75rem]"
                    >
                        {t('home.aboutShan.title')}
                    </h2>
                ) : (
                    <ScrollRevealLine
                        as="h2"
                        id="about-shan-heading"
                        text={t('home.aboutShan.title')}
                        className="mb-10 text-center font-display text-2xl font-normal tracking-tight text-navy-900 sm:mb-12 sm:text-[1.75rem]"
                    />
                )}

                <div className="space-y-6">
                    {paragraphs.map((key) =>
                        reduced ? (
                            <p key={key} className={bodyClass}>
                                {t(`home.aboutShan.${key}`)}
                            </p>
                        ) : (
                            <ScrollRevealParagraph
                                key={key}
                                text={t(`home.aboutShan.${key}`)}
                                className={bodyClass}
                            />
                        ),
                    )}
                </div>

                <footer className="mt-8 text-center sm:mt-10">
                    {reduced ? (
                        <>
                            <p className="font-display text-[1.75rem] font-normal leading-tight tracking-tight text-navy-900 sm:text-[1.875rem]">
                                {t('home.aboutShan.signName')}
                            </p>
                            <p className="mt-2 font-display text-sm font-normal italic text-muted sm:text-base">
                                {t('home.aboutShan.signRole')}
                            </p>
                        </>
                    ) : (
                        <>
                            <ScrollRevealLine
                                text={t('home.aboutShan.signName')}
                                className="font-display text-[1.75rem] font-normal leading-tight tracking-tight text-navy-900 sm:text-[1.875rem]"
                            />
                            <ScrollRevealParagraph
                                text={t('home.aboutShan.signRole')}
                                className="mt-2 font-display text-sm font-normal italic text-[#293340] sm:text-base"
                            />
                        </>
                    )}
                </footer>
            </div>
        </section>
    );
}
