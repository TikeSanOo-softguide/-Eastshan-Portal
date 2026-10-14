import { useTranslation } from 'react-i18next';

const labels = {
    en: 'EN',
    my: 'မြန်မာ',
    zh: '中文',
};

export default function AvailableLocalesNotice({
    available = [],
    missing = false,
}) {
    const { t } = useTranslation();

    if (!missing || !available.length) {
        return null;
    }

    return (
        <p
            data-testid="available-locales"
            className="mt-4 inline-flex flex-wrap items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm text-muted"
            role="status"
        >
            <span>{t('articles.availableIn')}</span>
            <span className="font-medium text-text">
                {available.map((code) => labels[code] ?? code).join(' / ')}
            </span>
        </p>
    );
}
