/**
 * Frontend-only sample news — shared images with the home Latest News grid.
 */
export const NEWS_IMAGES = [
    '/images/news/dvb-1.jpg',
    '/images/news/dvb-2.jpg',
    '/images/news/dvb-3.jpg',
    '/images/news/dvb-4.jpg',
    '/images/news/dvb-5.jpg',
];

/** Nine cards for a 3×3 news page grid. */
export const NEWS_SAMPLES = Array.from({ length: 9 }, (_, index) => ({
    id: index + 1,
    image: NEWS_IMAGES[index % NEWS_IMAGES.length],
    titleKey: `news.items.${index}.title`,
    excerptKey: `news.items.${index}.excerpt`,
}));
