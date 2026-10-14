import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const locales = ['en', 'my', 'zh'];
const labels = { en: 'common.language.en', my: 'common.language.my', zh: 'common.language.zh' };

export default function LocaleTabs({ children }) {
    const { t } = useTranslation();
    const [active, setActive] = useState('en');

    return (
        <div>
            <div className="mb-4 flex gap-1 border-b border-border" role="tablist">
                {locales.map((locale) => (
                    <button
                        key={locale}
                        type="button"
                        role="tab"
                        aria-selected={active === locale}
                        onClick={() => setActive(locale)}
                        className={`min-h-11 border-b-2 px-4 text-sm font-medium ${
                            active === locale ? 'border-navy-600 text-text dark:border-gold-400' : 'border-transparent text-muted hover:text-text'
                        }`}
                    >
                        {t(labels[locale])}
                    </button>
                ))}
            </div>
            <div role="tabpanel">{children(active)}</div>
        </div>
    );
}
