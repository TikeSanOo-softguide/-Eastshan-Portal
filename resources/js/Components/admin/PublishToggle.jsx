import { useTranslation } from 'react-i18next';

export default function PublishToggle({ checked, onChange, label }) {
    const { t } = useTranslation();
    return (
        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-border bg-bg p-4">
            <span>
                <span className="block text-sm font-medium text-text">{label ?? t('admin.form.publish')}</span>
                <span className="block text-xs text-muted">{checked ? t('admin.form.published') : t('admin.form.draft')}</span>
            </span>
            <input type="checkbox" className="peer sr-only" checked={Boolean(checked)} onChange={(e) => onChange(e.target.checked)} />
            <span className="relative h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-navy-700 peer-focus-visible:ring-2 peer-focus-visible:ring-accent dark:bg-slate-600 after:absolute after:start-1 after:top-1 after:size-4 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5 rtl:peer-checked:after:-translate-x-5" />
        </label>
    );
}
