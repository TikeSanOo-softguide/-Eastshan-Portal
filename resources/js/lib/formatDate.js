export function formatDate(iso, locale) {
    if (!iso) {
        return '';
    }

    try {
        return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : locale, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }).format(new Date(iso));
    } catch {
        return iso.slice(0, 10);
    }
}
