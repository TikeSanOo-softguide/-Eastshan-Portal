import { CheckCircle2, X, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function FlashToasts({ flash = {} }) {
    const { t, i18n } = useTranslation();
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const resolve = (value) => {
            if (!value || typeof value !== 'string') {
                return null;
            }

            return i18n.exists(value) ? t(value) : value;
        };

        const next = [
            flash.success && {
                id: `success-${Date.now()}`,
                type: 'success',
                text: resolve(flash.success),
            },
            flash.error && {
                id: `error-${Date.now()}`,
                type: 'error',
                text: resolve(flash.error),
            },
        ].filter((item) => item && item.text);

        setMessages(next);

        if (!next.length) {
            return undefined;
        }

        const timer = window.setTimeout(() => setMessages([]), 5000);

        return () => window.clearTimeout(timer);
    }, [flash.success, flash.error, i18n, t]);

    return (
        <div
            className="fixed end-4 top-20 z-[60] flex w-[min(24rem,calc(100%-2rem))] flex-col gap-2"
            aria-live="polite"
        >
            {messages.map((message) => {
                const Icon = message.type === 'success' ? CheckCircle2 : XCircle;

                return (
                    <div
                        key={message.id}
                        className={`flex items-start gap-3 rounded-lg border bg-surface p-4 shadow-lg ${message.type === 'success' ? 'border-emerald-500/40' : 'border-red-500/40'}`}
                    >
                        <Icon
                            className={`mt-0.5 size-5 shrink-0 ${message.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}
                        />
                        <p className="min-w-0 flex-1 text-sm text-text">
                            {message.text}
                        </p>
                        <button
                            type="button"
                            onClick={() =>
                                setMessages((items) =>
                                    items.filter((item) => item.id !== message.id),
                                )
                            }
                            className="text-muted hover:text-text"
                            aria-label={t('admin.flash.dismiss', {
                                defaultValue: 'Dismiss',
                            })}
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
