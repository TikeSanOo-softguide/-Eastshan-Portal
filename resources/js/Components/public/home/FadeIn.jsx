import {
    fadeUp,
    motionTransition,
    usePrefersReducedMotion,
} from '@/lib/usePrefersReducedMotion';
import { motion } from 'framer-motion';

export default function FadeIn({
    as: Tag = motion.div,
    children,
    className = '',
    delay = 0,
    ...props
}) {
    const reduced = usePrefersReducedMotion();

    return (
        <Tag
            className={className}
            initial={reduced ? false : 'hidden'}
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            transition={motionTransition(reduced, 0.55 + delay * 0.05)}
            {...props}
        >
            {children}
        </Tag>
    );
}
