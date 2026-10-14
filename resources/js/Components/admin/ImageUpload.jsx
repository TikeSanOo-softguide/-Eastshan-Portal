import { ImageIcon, X } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ImageUpload({ label, value, onChange, error, accept = 'image/jpeg,image/png,image/webp,image/gif' }) {
    const { t } = useTranslation();
    const inputId = useId();
    const [preview, setPreview] = useState(typeof value === 'string' ? value : null);

    useEffect(() => {
        if (!(value instanceof File)) {
            setPreview(typeof value === 'string' ? value : null);
            return undefined;
        }
        const url = URL.createObjectURL(value);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [value]);

    return (
        <div>
            <label htmlFor={inputId} className="admin-label">{label}</label>
            <label htmlFor={inputId} className="mt-1 flex min-h-32 cursor-pointer items-center justify-center rounded-lg border border-dashed border-border bg-bg p-4 hover:border-navy-400">
                <input id={inputId} type="file" accept={accept} className="sr-only" aria-label={label} onChange={(e) => onChange(e.target.files?.[0] ?? null)} />
                {preview ? (
                    <img src={preview} alt="" className="max-h-40 rounded-md object-contain" />
                ) : (
                    <span className="flex flex-col items-center gap-2 text-sm text-muted"><ImageIcon className="size-6" />{t('admin.form.chooseImage')}</span>
                )}
            </label>
            {value instanceof File ? <button type="button" onClick={() => { setPreview(null); onChange(null); }} className="mt-2 inline-flex items-center gap-1 text-sm text-red-600 dark:text-red-400"><X className="size-4" />{t('admin.form.removeImage')}</button> : null}
            {error ? <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p> : null}
        </div>
    );
}
