import { Link } from '@inertiajs/react';

export default function StatCard({ label, value, href, icon: Icon }) {
    const content = (
        <div className="rounded-xl border border-border bg-surface p-5 shadow-sm transition hover:border-navy-300 dark:hover:border-navy-600">
            <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-muted">{label}</p>
                {Icon ? <Icon className="size-5 text-navy-600 dark:text-gold-300" /> : null}
            </div>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-text">{value}</p>
        </div>
    );
    return href ? <Link href={href}>{content}</Link> : content;
}
