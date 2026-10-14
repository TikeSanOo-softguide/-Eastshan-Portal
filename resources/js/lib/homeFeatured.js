/**
 * Priority cards on the public home page.
 * Media lives under /public/videos — replace placeholders with stock footage.
 */
export const featuredCards = [
    {
        key: 'institutions',
        titleKey: 'home.featured.institutions.title',
        bodyKey: 'home.featured.institutions.body',
        href: '/institutions',
        video: '/videos/card-1.mp4',
        poster: '/videos/card-1.jpg',
        width: 960,
        height: 640,
    },
    {
        key: 'leadership',
        titleKey: 'home.featured.leadership.title',
        bodyKey: 'home.featured.leadership.body',
        href: '/leadership',
        video: '/videos/card-2.mp4',
        poster: '/videos/card-2.jpg',
        width: 960,
        height: 640,
    },
    {
        key: 'history',
        titleKey: 'home.featured.history.title',
        bodyKey: 'home.featured.history.body',
        href: '/about/history',
        video: '/videos/card-3.mp4',
        poster: '/videos/card-3.jpg',
        width: 960,
        height: 640,
    },
    {
        key: 'infrastructure',
        titleKey: 'home.featured.infrastructure.title',
        bodyKey: 'home.featured.infrastructure.body',
        href: '/infrastructure/education',
        video: '/videos/card-4.mp4',
        poster: '/videos/card-4.jpg',
        width: 960,
        height: 640,
    },
    {
        key: 'culture',
        titleKey: 'home.featured.culture.title',
        bodyKey: 'home.featured.culture.body',
        href: '/heritage',
        video: '/videos/card-5.mp4',
        poster: '/videos/card-5.jpg',
        width: 960,
        height: 640,
    },
    {
        key: 'news',
        titleKey: 'home.featured.news.title',
        bodyKey: 'home.featured.news.body',
        href: '/news',
        video: '/videos/card-6.mp4',
        poster: '/videos/card-6.jpg',
        width: 960,
        height: 640,
    },
];

export const heroMedia = {
    videos: ['/videos/_source.mp4', '/videos/_source1.mp4'],
    poster: '/videos/hero.jpg',
    width: 1920,
    height: 1080,
};
