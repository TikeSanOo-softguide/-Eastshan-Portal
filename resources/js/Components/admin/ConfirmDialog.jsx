import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

export default function ConfirmDialog({ open, title, body, confirmLabel, onConfirm, onClose, busy = false }) {
    const { t } = useTranslation();
    const cancelRef = useRef(null);

    useEffect(() => {
        if (!open) return undefined;
        cancelRef.current?.focus();
        const onKeyDown = (event) => event.key === 'Escape' && onClose();
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-navy-950/70 p-4" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
            <div className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-2xl" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
                <h2 id="confirm-title" className="text-lg font-semibold text-text">{title ?? t('admin.confirm.title')}</h2>
                <p className="mt-2 text-sm text-muted">{body ?? t('admin.confirm.body')}</p>
                <div className="mt-6 flex justify-end gap-3">
                    <button ref={cancelRef} type="button" onClick={onClose} className="admin-button-secondary">{t('common.cancel')}</button>
                    <button type="button" disabled={busy} onClick={onConfirm} className="admin-button-danger">
                        {confirmLabel ?? t('admin.confirm.delete')}
                    </button>
                </div>
            </div>
        </div>
    );
}
