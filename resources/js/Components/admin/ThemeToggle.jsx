import useTheme from '@/hooks/useTheme';
import { THEME_OPTIONS } from '@/lib/theme';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const icons = { light: Sun, dark: Moon, system: Monitor };

export default function ThemeToggle() {
    const { t } = useTranslation();
    const { preference, setTheme } = useTheme();

    return (
        <div className="flex rounded-lg border border-border bg-bg p-1" aria-label={t('admin.theme.label')}>
            {THEME_OPTIONS.map((option) => {
                const Icon = icons[option];
                return (
                    <button
                        key={option}
                        type="button"
                        title={t(`admin.theme.${option}`)}
                        aria-label={t(`admin.theme.${option}`)}
                        aria-pressed={preference === option}
                        onClick={() => setTheme(option)}
                        className={`inline-flex size-9 items-center justify-center rounded-md transition ${
                            preference === option
                                ? 'bg-navy-900 text-white dark:bg-navy-600'
                                : 'text-muted hover:bg-surface hover:text-text'
                        }`}
                    >
                        <Icon className="size-4" aria-hidden="true" />
                    </button>
                );
            })}
        </div>
    );
}
