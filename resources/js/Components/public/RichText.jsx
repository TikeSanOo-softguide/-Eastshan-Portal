import { sanitizeHtml } from '@/lib/sanitizeHtml';

export default function RichText({ html, className = '' }) {
    const clean = sanitizeHtml(html);

    if (!clean) {
        return null;
    }

    return (
        <div
            className={`prose-public space-y-4 text-base leading-7 text-text [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:tracking-tight [&_h3]:font-display [&_h3]:text-xl [&_a]:underline [&_a]:decoration-accent ${className}`}
            dangerouslySetInnerHTML={{ __html: clean }}
        />
    );
}
