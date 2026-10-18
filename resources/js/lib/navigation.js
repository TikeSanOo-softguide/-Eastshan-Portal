/**
 * Public menu. Every `href` must exist as a key in config/public_pages.php.
 */
export const navigation = [
    {
        key: 'nav.newsLiterature',
        href: '/news',
        children: [
            { key: 'nav.dailyNews', href: '/news', quick: true },
            { key: 'nav.knowledge', href: '/articles/knowledge' },
            { key: 'nav.literary', href: '/articles/literary' },
            { key: 'nav.newsArticles', href: '/articles/news' },
        ],
    },
    {
        key: 'nav.institutions',
        href: '/institutions',
        quick: true,
    },
    {
        key: 'nav.leadership',
        href: '/leadership',
    },
    {
        key: 'nav.gallery',
        href: '/gallery',
    },
    {
        key: 'nav.about',
        href: '/about/history',
        children: [
            { key: 'nav.history', href: '/about/history', quick: true },
            { key: 'nav.socioEconomy', href: '/about/socio-economy' },
            { key: 'nav.religion', href: '/about/religion' },
            { key: 'nav.customs', href: '/about/customs' },
        ],
    },
    {
        key: 'nav.infrastructure',
        href: '/infrastructure/education',
        children: [
            { key: 'nav.education', href: '/infrastructure/education' },
            { key: 'nav.health', href: '/infrastructure/health' },
            { key: 'nav.electricity', href: '/infrastructure/electricity' },
            {
                key: 'nav.roadsBridges',
                href: '/infrastructure/roads-bridges',
            },
        ],
    },
    {
        key: 'nav.heritage',
        href: '/heritage',
        quick: true,
    },
    {
        key: 'nav.contact',
        href: '/contact',
        quick: true,
    },
];

export const searchHref = '/search';

export const adminPrefix = '/mongla';

export function localizedHref(locale, href) {
    const path = href.startsWith('/') ? href : `/${href}`;
    const defaultLocale = 'my';

    if (!locale || locale === defaultLocale) {
        return path;
    }

    return path === '/' ? `/${locale}` : `/${locale}${path}`;
}

export function adminHref(href) {
    return `${adminPrefix}${href}`;
}

export function currentPath(url) {
    const path = url.split('?')[0];

    return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
}

export function isCurrentHref(url, locale, href) {
    const path = currentPath(url);
    const target = localizedHref(locale, href);

    return path === target || path.startsWith(`${target}/`);
}

export function activeBranch(url, locale, items = navigation) {
    return (
        items.find(
            (item) => item.children && branchIsCurrent(url, locale, item),
        ) ?? null
    );
}

export function branchIsCurrent(url, locale, item) {
    if (item.href && isCurrentHref(url, locale, item.href)) {
        return true;
    }

    return (item.children ?? []).some((child) =>
        isCurrentHref(url, locale, child.href),
    );
}

export function quickLinks(items = navigation) {
    return items.flatMap((item) => {
        const own = item.quick && item.href ? [item] : [];

        return own.concat(quickLinks(item.children ?? []));
    });
}
