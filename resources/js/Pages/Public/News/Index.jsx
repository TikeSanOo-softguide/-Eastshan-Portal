import Breadcrumb from '@/Components/public/Breadcrumb';
import Container from '@/Components/ui/Container';
import { localizedHref } from '@/lib/navigation';
import { NEWS_SAMPLES } from '@/lib/newsSamples';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

function NewsCard({ item, t }) {
    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-[0_6px_18px_-12px_rgba(10,20,51,0.28)] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_12px_24px_-14px_rgba(10,20,51,0.32)] sm:rounded-2xl">
            <div className="relative aspect-[16/10] overflow-hidden bg-navy-50">
                <img
                    src={item.image}
                    alt=""
                    width={800}
                    height={500}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                />
            </div>

            <div className="flex flex-1 flex-col gap-2 px-4 py-3 sm:px-5 sm:py-4">
                <h3 className="font-display text-lg font-normal tracking-tight text-navy-950 transition group-hover:text-navy-900 sm:text-xl">
                    {t(item.titleKey)}
                </h3>
                <p className="line-clamp-3 text-sm leading-6 text-[#6b6b6b]">
                    {t(item.excerptKey)}
                </p>
            </div>
        </article>
    );
}

export default function NewsIndex() {
    const { t } = useTranslation();
    const locale = usePage().props.locale ?? 'my';

    return (
        <PublicLayout>
            <Head title={t('news.metaTitle')}>
                <meta
                    head-key="description"
                    name="description"
                    content={t('news.metaDescription')}
                />
            </Head>

            <Container className="py-6 sm:py-8">
                <Breadcrumb
                    items={[
                        {
                            label: t('nav.home'),
                            href: localizedHref(locale, '/'),
                        },
                        { label: t('nav.newsLiterature') },
                        { label: t('nav.dailyNews') },
                    ]}
                />

                <ul className="mt-4 grid list-none grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7">
                    {NEWS_SAMPLES.map((item) => (
                        <li key={item.id} className="min-w-0">
                            <Link
                                href={localizedHref(locale, '/news')}
                                className="block h-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                            >
                                <NewsCard item={item} t={t} />
                            </Link>
                        </li>
                    ))}
                </ul>
            </Container>
        </PublicLayout>
    );
}
