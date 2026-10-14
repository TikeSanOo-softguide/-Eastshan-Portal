import { useEffect, useState } from 'react';

export function usePrefersReducedMotion() {
    const [reduced, setReduced] = useState(() => {
        if (typeof window === 'undefined') {
            return false;
        }

        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    });

    useEffect(() => {
        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => setReduced(media.matches);

        update();
        media.addEventListener('change', update);

        return () => media.removeEventListener('change', update);
    }, []);

    return reduced;
}

export function motionTransition(reduced, duration = 0.2) {
    return reduced ? { duration: 0 } : { duration, ease: 'easeOut' };
}

export const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0 },
};

export const staggerChildren = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};
