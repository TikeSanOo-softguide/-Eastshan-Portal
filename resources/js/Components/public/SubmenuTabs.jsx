import { cx } from '@/lib/cx';
import {
    activeBranch,
    isCurrentHref,
    localizedHref,
} from '@/lib/navigation';
import { Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function SubmenuTabs() {
    const { t } = useTranslation();
    const page = usePage();
    const locale = page.props.locale ?? 'my';
    const section = activeBranch(page.url, locale);

    if (!section?.children?.length) {
        return null;
    }

    return (
        <nav
            data-testid="submenu-tabs"
            aria-label={t(section.key)}
            className="bg-white"
        >
            <ul className="mx-auto flex w-full max-w-content flex-wrap items-center justify-center gap-1 px-4 py-3 sm:px-6">
                {section.children.map((child) => {
                    const current = isCurrentHref(page.url, locale, child.href);

                    return (
                        <li key={child.key}>
                            <Link
                                href={localizedHref(locale, child.href)}
                                className={cx(
                                    'inline-flex items-center whitespace-nowrap rounded-[8px] px-3 py-2.5 text-[13px] font-normal uppercase tracking-[0.15em] transition-colors duration-200',
                                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                                    current
                                        ? 'bg-navy-900 text-white'
                                        : 'bg-transparent text-text/80 hover:text-navy-900',
                                )}
                                aria-current={current ? 'page' : undefined}
                            >
                                {t(child.key)}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
