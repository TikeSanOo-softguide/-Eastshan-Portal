import { cx } from '@/lib/cx';
import { heroMedia } from '@/lib/homeFeatured';
import { useCanAutoplayVideo } from '@/lib/useCanAutoplayVideo';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const clips = heroMedia.videos;

export default function HeroSection() {
    const { t } = useTranslation();
    const allowVideo = useCanAutoplayVideo({ deferUntilPaint: true });
    const [active, setActive] = useState(0);
    const videoRefs = useRef([]);
    const failedRef = useRef(new Set());

    useEffect(() => {
        if (!allowVideo) {
            return undefined;
        }

        videoRefs.current.forEach((video, index) => {
            if (!video) {
                return;
            }

            if (index === active) {
                video.currentTime = 0;
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        });

        return undefined;
    }, [allowVideo, active]);

    const advance = (index) => {
        failedRef.current.add(index);

        if (failedRef.current.size >= clips.length) {
            return;
        }

        setActive((current) => {
            let next = (current + 1) % clips.length;
            let guard = 0;

            while (
                failedRef.current.has(next) &&
                guard < clips.length
            ) {
                next = (next + 1) % clips.length;
                guard += 1;
            }

            return next;
        });
    };

    return (
        <section
            data-testid="home-hero"
            data-immersive-hero
            className="sticky top-0 z-0 -mt-[var(--site-chrome,0px)] min-h-[100svh] overflow-hidden bg-navy-900 pt-[var(--site-chrome,0px)]"
        >
            <h1 className="sr-only">{t('home.hero.title')}</h1>
            <div className="absolute inset-0" aria-hidden="true">
                <img
                    src={heroMedia.poster}
                    alt=""
                    width={heroMedia.width}
                    height={heroMedia.height}
                    decoding="async"
                    fetchPriority="high"
                    className="h-full w-full object-cover"
                />
                {allowVideo
                    ? clips.map((src, index) => (
                          <video
                              key={src}
                              ref={(node) => {
                                  videoRefs.current[index] = node;
                              }}
                              className={cx(
                                  'absolute inset-0 h-full w-full object-cover transition-opacity duration-700',
                                  active === index
                                      ? 'z-10 opacity-100'
                                      : 'z-0 opacity-0',
                              )}
                              muted
                              playsInline
                              preload="auto"
                              width={heroMedia.width}
                              height={heroMedia.height}
                              onEnded={() =>
                                  setActive((index + 1) % clips.length)
                              }
                              onError={() => advance(index)}
                          >
                              <source src={src} type="video/mp4" />
                          </video>
                      ))
                    : null}
                <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-40 bg-gradient-to-b from-navy-950/50 to-transparent" />
            </div>
        </section>
    );
}
