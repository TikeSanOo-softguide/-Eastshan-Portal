import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion';

function connectionSaysSaveData() {
    if (typeof navigator === 'undefined') {
        return false;
    }

    return Boolean(navigator.connection?.saveData);
}

function isNarrowViewport() {
    if (typeof window === 'undefined') {
        return false;
    }

    return window.matchMedia('(max-width: 767px)').matches;
}

/**
 * Hero and card looping videos stay off on reduced motion, Save-Data,
 * and narrow screens (poster only). Desktop can load video after paint.
 */
export function useCanAutoplayVideo({ deferUntilPaint = false } = {}) {
    const reduced = usePrefersReducedMotion();
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
        if (reduced || connectionSaysSaveData() || isNarrowViewport()) {
            setAllowed(false);

            return undefined;
        }

        if (!deferUntilPaint) {
            setAllowed(true);

            return undefined;
        }

        let cancelled = false;
        const idle =
            typeof window.requestIdleCallback === 'function'
                ? window.requestIdleCallback(
                      () => {
                          if (!cancelled) {
                              setAllowed(true);
                          }
                      },
                      { timeout: 1200 },
                  )
                : null;

        const timeout =
            idle === null
                ? window.setTimeout(() => {
                      if (!cancelled) {
                          setAllowed(true);
                      }
                  }, 200)
                : null;

        const onResize = () => {
            if (isNarrowViewport() || connectionSaysSaveData()) {
                setAllowed(false);
            }
        };

        window.addEventListener('resize', onResize);

        return () => {
            cancelled = true;
            window.removeEventListener('resize', onResize);

            if (
                idle !== null &&
                typeof window.cancelIdleCallback === 'function'
            ) {
                window.cancelIdleCallback(idle);
            }

            if (timeout !== null) {
                window.clearTimeout(timeout);
            }
        };
    }, [reduced, deferUntilPaint]);

    return allowed;
}
