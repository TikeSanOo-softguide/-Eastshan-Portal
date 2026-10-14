import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Badge from '@/Components/ui/Badge';
import Button from '@/Components/ui/Button';
import Card from '@/Components/ui/Card';
import Container from '@/Components/ui/Container';
import SectionTitle from '@/Components/ui/SectionTitle';
import Skeleton from '@/Components/ui/Skeleton';
import PublicLayout from '@/Layouts/PublicLayout';
import { cx } from '@/lib/cx';

const navy = [
    ['navy-50', 'bg-navy-50'],
    ['navy-100', 'bg-navy-100'],
    ['navy-200', 'bg-navy-200'],
    ['navy-300', 'bg-navy-300'],
    ['navy-400', 'bg-navy-400'],
    ['navy-500', 'bg-navy-500'],
    ['navy-600', 'bg-navy-600'],
    ['navy-700', 'bg-navy-700'],
    ['navy-800', 'bg-navy-800'],
    ['navy-900', 'bg-navy-900'],
];
const gold = [
    ['gold-50', 'bg-gold-50'],
    ['gold-100', 'bg-gold-100'],
    ['gold-200', 'bg-gold-200'],
    ['gold-300', 'bg-gold-300'],
    ['gold-400', 'bg-gold-400'],
    ['gold-500', 'bg-gold-500'],
    ['gold-600', 'bg-gold-600'],
    ['gold-700', 'bg-gold-700'],
    ['gold-800', 'bg-gold-800'],
    ['gold-900', 'bg-gold-900'],
];
const slate = [
    ['slate-50', 'bg-slate-50'],
    ['slate-200', 'bg-slate-200'],
    ['slate-400', 'bg-slate-400'],
    ['slate-600', 'bg-slate-600'],
    ['slate-800', 'bg-slate-800'],
];

function Swatch({ name, className }) {
    const { t } = useTranslation();
    return (
        <div>
            <div
                className={cx(
                    'h-12 rounded-md border border-border',
                    className,
                )}
            />
            <p className="mt-2 text-xs text-muted">
                {t('home.styleGuide.swatch', { name })}
            </p>
        </div>
    );
}

function Gallery() {
    const { t } = useTranslation();
    const [note, setNote] = useState('home.styleGuide.idle');

    return (
        <div className="space-y-10 p-6 sm:p-8">
            <SectionTitle
                eyebrow={t('home.styleGuide.specimenEyebrow')}
                title={t('home.styleGuide.specimenTitle')}
            >
                {t('home.styleGuide.specimenBody')}
            </SectionTitle>

            <div className="flex flex-wrap gap-3">
                <Button onClick={() => setNote('home.styleGuide.pressedPrimary')}>
                    {t('home.styleGuide.primary')}
                </Button>
                <Button
                    variant="outline"
                    onClick={() => setNote('home.styleGuide.pressedOutline')}
                >
                    {t('home.styleGuide.outline')}
                </Button>
                <Button
                    variant="ghost"
                    onClick={() => setNote('home.styleGuide.pressedGhost')}
                >
                    {t('home.styleGuide.ghost')}
                </Button>
                <Button disabled>{t('home.styleGuide.disabled')}</Button>
            </div>
            <p className="text-sm text-muted" role="status">
                {t(note)}
            </p>

            <div className="flex flex-wrap items-center gap-3">
                <Badge>{t('home.styleGuide.notice')}</Badge>
                <Badge tone="accent">{t('home.styleGuide.archive')}</Badge>
                <a
                    href="#type"
                    className="inline-flex min-h-11 items-center text-sm text-primary underline decoration-accent decoration-1 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                    {t('home.styleGuide.typeSamples')}
                </a>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                    <h3 className="font-display text-xl text-text">
                        {t('home.styleGuide.cardOneTitle')}
                    </h3>
                    <p className="mt-3 text-sm text-muted">
                        {t('home.styleGuide.cardOneBody')}
                    </p>
                </Card>
                <Card>
                    <h3 className="font-display text-xl text-text">
                        {t('home.styleGuide.cardTwoTitle')}
                    </h3>
                    <p className="mt-3 text-sm text-muted">
                        {t('home.styleGuide.cardTwoBody')}
                    </p>
                </Card>
            </div>

            <div className="space-y-3" aria-hidden="true">
                <Skeleton className="h-11 w-11 rounded-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
        </div>
    );
}

export default function StyleGuide() {
    const { t } = useTranslation();

    return (
        <PublicLayout>
            <Head title={t('home.styleGuide.title')} />
            <div className="light bg-bg text-text">
                <Container className="py-16">
                    <p className="text-sm text-muted">
                        {t('home.styleGuide.badge')}
                    </p>
                    <SectionTitle
                        eyebrow={t('home.styleGuide.eyebrow')}
                        title={t('home.styleGuide.title')}
                        className="mt-8"
                    >
                        {t('home.styleGuide.intro')}
                    </SectionTitle>

                    <div
                        id="type"
                        className="mt-14 grid gap-8 border-t border-border pt-10 md:grid-cols-3"
                    >
                        <div lang="en" className="min-w-0">
                            <p className="text-xs uppercase tracking-[0.16em] text-muted">
                                {t('home.styleGuide.english')}
                            </p>
                            <p className="mt-3 font-display text-3xl text-text">
                                {t('home.styleGuide.englishHeading')}
                            </p>
                            <p className="mt-2 font-sans text-sm text-muted">
                                {t('home.styleGuide.englishBody')}
                            </p>
                        </div>
                        <div lang="my" className="min-w-0">
                            <p className="text-xs uppercase tracking-[0.16em] text-muted">
                                {t('home.styleGuide.burmese')}
                            </p>
                            <p className="mt-3 font-myanmar text-2xl text-text">
                                {t('home.styleGuide.burmeseHeading')}
                            </p>
                            <p className="mt-2 font-myanmar text-sm text-muted">
                                {t('home.styleGuide.burmeseBody')}
                            </p>
                        </div>
                        <div lang="zh" className="min-w-0">
                            <p className="text-xs uppercase tracking-[0.16em] text-muted">
                                {t('home.styleGuide.chinese')}
                            </p>
                            <p className="mt-3 font-sc text-2xl text-text">
                                {t('home.styleGuide.chineseHeading')}
                            </p>
                            <p className="mt-2 font-sc text-sm text-muted">
                                {t('home.styleGuide.chineseBody')}
                            </p>
                        </div>
                    </div>

                    <div className="mt-14 grid gap-10 lg:grid-cols-2">
                        <section className="light overflow-hidden rounded-lg border border-border bg-bg">
                            <p className="border-b border-border px-6 py-4 text-sm font-medium text-text">
                                {t('home.styleGuide.light')}
                            </p>
                            <Gallery />
                        </section>
                        <section className="dark overflow-hidden rounded-lg border border-navy-800 bg-bg text-text">
                            <p className="border-b border-border px-6 py-4 text-sm font-medium text-text">
                                {t('home.styleGuide.dark')}
                            </p>
                            <Gallery />
                        </section>
                    </div>

                    <h2 className="mt-16 font-display text-2xl text-text">
                        {t('home.styleGuide.palette')}
                    </h2>
                    <span
                        className="mt-4 block h-px w-14 bg-accent"
                        aria-hidden="true"
                    />

                    <h3 className="mt-8 text-sm font-medium text-text">
                        {t('home.styleGuide.navy')}
                    </h3>
                    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-5">
                        {navy.map(([name, className]) => (
                            <Swatch
                                key={name}
                                name={name}
                                className={className}
                            />
                        ))}
                    </div>

                    <h3 className="mt-8 text-sm font-medium text-text">
                        {t('home.styleGuide.gold')}
                    </h3>
                    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-5">
                        {gold.map(([name, className]) => (
                            <Swatch
                                key={name}
                                name={name}
                                className={className}
                            />
                        ))}
                    </div>

                    <h3 className="mt-8 text-sm font-medium text-text">
                        {t('home.styleGuide.slateAndWhite')}
                    </h3>
                    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-6">
                        <Swatch
                            name={t('home.styleGuide.white')}
                            className="bg-white"
                        />
                        {slate.map(([name, className]) => (
                            <Swatch
                                key={name}
                                name={name}
                                className={className}
                            />
                        ))}
                    </div>

                    <h3 className="mt-8 text-sm font-medium text-text">
                        {t('home.styleGuide.themeTokens')}
                    </h3>
                    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <Swatch name="bg" className="bg-bg" />
                        <Swatch name="surface" className="bg-surface" />
                        <Swatch name="primary" className="bg-primary" />
                        <Swatch name="accent" className="bg-accent" />
                        <Swatch name="text" className="bg-text" />
                        <Swatch name="muted" className="bg-muted" />
                        <Swatch name="border" className="bg-border" />
                        <Swatch name="on-primary" className="bg-on-primary" />
                    </div>
                </Container>
            </div>
        </PublicLayout>
    );
}
