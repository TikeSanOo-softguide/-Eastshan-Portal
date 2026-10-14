import { cx } from '@/lib/cx';

export default function SectionTitle({
    eyebrow,
    title,
    children,
    as: Heading = 'h2',
    className = '',
    id,
}) {
    return (
        <div className={cx('max-w-2xl', className)}>
            {eyebrow ? (
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
                    {eyebrow}
                </p>
            ) : null}
            <Heading
                id={id}
                className="mt-3 font-display text-3xl font-medium tracking-tight text-text md:text-4xl"
            >
                {title}
            </Heading>
            <span
                className="mt-4 block h-px w-14 bg-accent"
                aria-hidden="true"
            />
            {children ? (
                <p className="mt-4 text-base leading-7 text-muted">
                    {children}
                </p>
            ) : null}
        </div>
    );
}
