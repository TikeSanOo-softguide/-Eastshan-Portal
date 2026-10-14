import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function HttpError({ status = 404 }) {
    const { t } = useTranslation();
    const locale = usePage().props.locale ?? 'my';
    const key = status === 500 ? 'server' : 'notFound';

    return (
        <PublicLayout>
            <Head title={t(`errors.${key}.title`)} />
            <div className="mx-auto max-w-prose px-4 py-24 text-center">
                <p className="text-sm font-medium tracking-wide text-muted">
                    {status}
                </p>
                <h1 className="mt-3 font-display text-4xl text-text">
                    {t(`errors.${key}.title`)}
                </h1>
                <p className="mt-4 text-base leading-7 text-muted [html[lang=my]_&]:leading-[1.8]">
                    {t(`errors.${key}.body`)}
                </p>
                <Link
                    href={`/${locale}`}
                    className="mt-8 inline-flex min-h-11 items-center bg-primary px-5 text-sm font-medium text-on-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                    {t('errors.home')}
                </Link>
            </div>
        </PublicLayout>
    );
}
