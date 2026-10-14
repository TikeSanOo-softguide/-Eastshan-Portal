import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function FormActions({ cancelHref, processing }) {
    const { t } = useTranslation();
    return (
        <div className="flex justify-end gap-3 border-t border-border pt-5">
            <Link href={cancelHref} className="admin-button-secondary">{t('common.cancel')}</Link>
            <button type="submit" disabled={processing} className="admin-button-primary">
                {processing ? t('admin.form.saving') : t('common.save')}
            </button>
        </div>
    );
}
