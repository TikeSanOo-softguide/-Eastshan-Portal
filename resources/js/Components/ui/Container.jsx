import { cx } from '@/lib/cx';

export default function Container({ className = '', children, ...props }) {
    return (
        <div
            className={cx('mx-auto w-full max-w-content px-6', className)}
            {...props}
        >
            {children}
        </div>
    );
}
