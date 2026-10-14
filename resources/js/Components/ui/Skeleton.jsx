import { cx } from '@/lib/cx';

export default function Skeleton({ className = '', ...props }) {
    return (
        <div
            className={cx(
                'animate-pulse rounded-md bg-muted/20 motion-reduce:animate-none',
                className,
            )}
            aria-hidden="true"
            {...props}
        />
    );
}
