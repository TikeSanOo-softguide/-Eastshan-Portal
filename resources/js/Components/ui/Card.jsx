import { cx } from '@/lib/cx';

export default function Card({ className = '', children, ...props }) {
    return (
        <div
            className={cx(
                'rounded-lg border border-border bg-surface p-6 text-text',
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
}
