import ArticleCard from '@/Components/public/ArticleCard';
import AvailableLocalesNotice from '@/Components/public/AvailableLocalesNotice';
import Breadcrumb from '@/Components/public/Breadcrumb';
import RichText from '@/Components/public/RichText';
import ShareButtons from '@/Components/public/ShareButtons';
import Container from '@/Components/ui/Container';
import { formatDate } from '@/lib/formatDate';
import { localizedHref } from '@/lib/navigation';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function ArticleShow({ article, related = [] }) {
    const { t } = useTranslation();
    const locale = usePage().props.locale ?? 'my';
    const categoryLabel = t(`articles.categories.${article.category}`);

    return (
        <PublicLayout>
            <Head title={article.title}>
                <meta
                    head-key="description"
                    name="description"
                    content={article.excerpt || t('articles.metaDescription')}
                />
            </Head>

            <Container className="py-12 sm:py-16">
                <Breadcrumb
                    items={[
                        { label: t('nav.home'), href: localizedHref(locale, '/') },
                        {
                            label: categoryLabel,
                            href: localizedHref(
                                locale,
                                `/articles/${article.category}`,
                            ),
                        },
                        { label: article.title },
                    ]}
                />

                <article className="mx-auto max-w-prose">
                    <header>
                        <p className="text-xs uppercase tracking-[0.16em] text-muted">
                            {categoryLabel}
                        </p>
                        <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-text">
                            {article.title}
                        </h1>
                        <span
                            className="mt-4 block h-px w-14 bg-accent"
                            aria-hidden="true"
                        />
                        <p className="mt-5 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted">
                            {article.published_at ? (
                                <time dateTime={article.published_at}>
                                    {formatDate(article.published_at, locale)}
                                </time>
                            ) : null}
                            <span>
                                {t('articles.readingTime', {
                                    minutes: article.reading_time ?? 1,
                                })}
                            </span>
                            {article.author?.name ? (
                                <span>
                                    {t('articles.byline', {
                                        name: article.author.name,
                                    })}
                                </span>
                            ) : null}
                        </p>
                        <AvailableLocalesNotice
                            available={article.available_locales}
                            missing={article.missing_translation}
                        />
                    </header>

                    {article.cover ? (
                        <picture>
                            {article.cover_webp ? (
                                <source
                                    srcSet={article.cover_webp}
                                    type="image/webp"
                                />
                            ) : null}
                            <img
                                src={article.cover}
                                alt=""
                                width={960}
                                height={540}
                                className="mt-8 aspect-[16/9] w-full object-cover bg-navy-100"
                                onError={(event) => {
                                    event.currentTarget.style.display = 'none';
                                }}
                            />
                        </picture>
                    ) : null}

                    <div className="mt-8 text-base leading-7 [html[lang=my]_&]:leading-[1.8]">
                        <RichText html={article.body_html} />
                    </div>

                    <footer className="mt-10 border-t border-border pt-6">
                        <ShareButtons
                            url={article.share_url}
                            title={article.title}
                        />
                    </footer>
                </article>

                {related.length ? (
                    <section className="mt-16">
                        <h2 className="font-display text-2xl text-text">
                            {t('articles.related')}
                        </h2>
                        <span
                            className="mt-3 block h-px w-10 bg-accent"
                            aria-hidden="true"
                        />
                        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {related.map((item) => (
                                <li key={item.id}>
                                    <ArticleCard article={item} />
                                </li>
                            ))}
                        </ul>
                    </section>
                ) : null}
            </Container>
        </PublicLayout>
    );
}
