import { cx } from '@/lib/cx';

const tones = {
    neutral: 'border-border text-muted',
    accent: 'border-accent text-text',
};

export default function Badge({
    tone = 'neutral',
    className = '',
    children,
    ...props
}) {
    return (
        <span
            className={cx(
                'inline-flex items-center rounded-full border bg-surface px-3 py-1 text-xs font-medium tracking-wide',
                tones[tone] ?? tones.neutral,
                className,
            )}
            {...props}
        >
            {children}
        </span>
    );
}
