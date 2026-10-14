import Breadcrumb from '@/Components/public/Breadcrumb';
import PageHero from '@/Components/public/PageHero';
import Container from '@/Components/ui/Container';
import { localizedHref } from '@/lib/navigation';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

const fields = [
    ['name', 'text', 'contact.name'],
    ['email', 'email', 'contact.email'],
];

export default function ContactIndex() {
    const { t } = useTranslation();
    const locale = usePage().props.locale ?? 'my';
    const sent = usePage().props.flash?.success === 'contact.sent';
    const form = useForm({
        name: '',
        email: '',
        message: '',
    });

    const submit = (event) => {
        event.preventDefault();
        form.post(localizedHref(locale, '/contact'), {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    };

    return (
        <PublicLayout>
            <Head title={t('contact.metaTitle')}>
                <meta
                    head-key="description"
                    name="description"
                    content={t('contact.metaDescription')}
                />
            </Head>
            <Container className="py-12 sm:py-16">
                <Breadcrumb
                    items={[
                        { label: t('nav.home'), href: localizedHref(locale, '/') },
                        { label: t('nav.contact') },
                    ]}
                />
                <PageHero eyebrow={t('contact.eyebrow')} title={t('contact.title')}>
                    {t('contact.lead')}
                </PageHero>

                <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
                    <address className="not-italic text-sm leading-7 text-muted [html[lang=my]_&]:leading-[1.8]">
                        <p className="font-medium text-text">{t('footer.contactTitle')}</p>
                        <p className="mt-3">{t('footer.address')}</p>
                        <p className="mt-2">
                            <a className="underline decoration-accent underline-offset-4" href={`tel:${t('footer.phone').replace(/\s/g, '')}`}>
                                {t('footer.phone')}
                            </a>
                        </p>
                        <p>
                            <a className="underline decoration-accent underline-offset-4" href={`mailto:${t('footer.email')}`}>
                                {t('footer.email')}
                            </a>
                        </p>
                    </address>

                    <form className="space-y-4 border border-border bg-surface p-5" onSubmit={submit}>
                        {sent ? (
                            <p role="status" className="border border-border bg-bg px-4 py-3 text-sm text-text">
                                {t('contact.sent')}
                            </p>
                        ) : null}
                        {fields.map(([name, type, label]) => (
                            <label key={name} className="block text-sm">
                                <span className="mb-2 block text-muted">{t(label)}</span>
                                <input
                                    type={type}
                                    name={name}
                                    value={form.data[name]}
                                    onChange={(event) => form.setData(name, event.target.value)}
                                    className="min-h-11 w-full border-border bg-bg text-sm focus:border-accent focus:ring-accent"
                                    required
                                />
                                {form.errors[name] ? (
                                    <span className="mt-1 block text-sm text-red-700 dark:text-red-300">
                                        {form.errors[name]}
                                    </span>
                                ) : null}
                            </label>
                        ))}
                        <label className="block text-sm">
                            <span className="mb-2 block text-muted">{t('contact.message')}</span>
                            <textarea
                                name="message"
                                rows={6}
                                value={form.data.message}
                                onChange={(event) => form.setData('message', event.target.value)}
                                className="w-full border-border bg-bg text-sm leading-7 focus:border-accent focus:ring-accent [html[lang=my]_&]:leading-[1.8]"
                                required
                            />
                            {form.errors.message ? (
                                <span className="mt-1 block text-sm text-red-700 dark:text-red-300">
                                    {form.errors.message}
                                </span>
                            ) : null}
                        </label>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="inline-flex min-h-11 items-center bg-primary px-5 text-sm font-medium text-on-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60"
                        >
                            {t('contact.submit')}
                        </button>
                    </form>
                </div>
            </Container>
        </PublicLayout>
    );
}
