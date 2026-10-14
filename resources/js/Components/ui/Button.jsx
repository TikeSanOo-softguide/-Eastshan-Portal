import { cx } from '@/lib/cx';

const variants = {
    primary:
        'border border-primary bg-primary text-on-primary hover:bg-primary/90',
    outline: 'border border-border bg-transparent text-text hover:bg-text/5',
    ghost: 'border border-transparent bg-transparent text-text hover:bg-text/5',
};

export default function Button({
    variant = 'primary',
    className = '',
    disabled = false,
    type = 'button',
    children,
    ...props
}) {
    return (
        <button
            type={type}
            disabled={disabled}
            className={cx(
                'inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-medium transition-colors',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                'disabled:pointer-events-none disabled:opacity-40',
                variants[variant] ?? variants.primary,
                className,
            )}
            {...props}
        >
            {children}
        </button>
    );
}
