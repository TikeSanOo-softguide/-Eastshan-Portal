import { cx } from '@/lib/cx';
import { Link2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ShareButtons({ url, title }) {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title ?? '');

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
        }
    };

    const buttonClass = cx(
        'inline-flex min-h-11 items-center gap-2 border border-border px-4 text-sm text-text',
        'hover:bg-text/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
    );

    return (
        <div className="flex flex-wrap gap-2" aria-label={t('articles.share')}>
            <button type="button" className={buttonClass} onClick={copy}>
                <Link2 className="size-4" aria-hidden="true" />
                {copied ? t('articles.copied') : t('articles.copyLink')}
            </button>
            <a
                className={buttonClass}
                href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                {t('articles.shareX')}
            </a>
            <a
                className={buttonClass}
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                {t('articles.shareFacebook')}
            </a>
        </div>
    );
}
