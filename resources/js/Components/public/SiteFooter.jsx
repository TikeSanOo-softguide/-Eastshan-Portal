import { cx } from '@/lib/cx';
import { isCurrentHref, localizedHref, quickLinks } from '@/lib/navigation';
import { Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import Container from '@/Components/ui/Container';

const focusClass =
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

function ColumnTitle({ children }) {
    return (
        <div>
            <h2 className="font-display text-lg text-white">{children}</h2>
            <span
                className="mt-3 block h-px w-10 bg-accent"
                aria-hidden="true"
            />
        </div>
    );
}

export default function SiteFooter() {
    const { t } = useTranslation();
    const page = usePage();
    const locale = page.props.locale ?? 'my';
    const year = new Date().getFullYear();

    return (
        <footer data-testid="site-footer" className="bg-navy-900 text-white">
            <Container className="grid gap-10 py-16 md:grid-cols-3">
                <div className="min-w-0">
                    <ColumnTitle>{t('footer.aboutTitle')}</ColumnTitle>
                    <p className="mt-4 text-sm text-white/80">
                        {t('footer.aboutBody')}
                    </p>
                </div>

                <div className="min-w-0">
                    <ColumnTitle>{t('footer.quickLinks')}</ColumnTitle>
                    <ul className="mt-4">
                        {quickLinks().map((item) => {
                            const current = isCurrentHref(
                                page.url,
                                locale,
                                item.href,
                            );

                            return (
                                <li key={item.key}>
                                    <Link
                                        href={localizedHref(locale, item.href)}
                                        className={cx(
                                            'inline-flex min-h-11 items-center border-b text-sm text-white/80 hover:text-white',
                                            focusClass,
                                            current
                                                ? 'border-accent text-white'
                                                : 'border-transparent',
                                        )}
                                        aria-current={
                                            current ? 'page' : undefined
                                        }
                                    >
                                        {t(item.key)}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div className="min-w-0">
                    <ColumnTitle>{t('footer.contactTitle')}</ColumnTitle>
                    <address className="mt-4 text-sm not-italic text-white/80">
                        <p>{t('footer.address')}</p>
                        <a
                            href="tel:+9510000000"
                            className={cx(
                                'inline-flex min-h-11 items-center hover:text-white',
                                focusClass,
                            )}
                        >
                            {t('footer.phone')}
                        </a>
                        <a
                            href="mailto:contact@example.com"
                            className={cx(
                                'flex min-h-11 items-center break-all hover:text-white',
                                focusClass,
                            )}
                        >
                            {t('footer.email')}
                        </a>
                    </address>
                </div>
            </Container>

            <div className="border-t border-white/20">
                <Container className="py-4 text-sm text-white/70">
                    {t('footer.copyright', { year })}
                </Container>
            </div>
        </footer>
    );
}
