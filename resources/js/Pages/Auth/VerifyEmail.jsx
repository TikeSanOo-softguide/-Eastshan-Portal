import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { localizedHref } from '@/lib/navigation';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function VerifyEmail({ status }) {
    const { t } = useTranslation();
    const locale = usePage().props.locale ?? 'my';
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(localizedHref(locale, '/email/verification-notification'));
    };

    return (
        <GuestLayout>
            <Head title={t('common.verifyTitle')} />

            <div className="mb-4 text-sm text-gray-600">
                {t('common.verifyBody')}
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {t('common.verifySent')}
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mt-4 flex items-center justify-between">
                    <PrimaryButton disabled={processing}>
                        {t('common.resendVerificationEmail')}
                    </PrimaryButton>

                    <Link
                        href={localizedHref(locale, '/logout')}
                        method="post"
                        as="button"
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        {t('nav.logout')}
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
