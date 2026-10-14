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
            className="border-t border-black/10 bg-white"
        >
            <ul className="mx-auto flex w-full max-w-content gap-1 overflow-x-auto px-4 sm:px-6">
                {section.children.map((child) => {
                    const current = isCurrentHref(page.url, locale, child.href);

                    return (
                        <li key={child.key} className="shrink-0">
                            <Link
                                href={localizedHref(locale, child.href)}
                                className={cx(
                                    'inline-flex min-h-11 items-center whitespace-nowrap border-b-2 px-4 text-[18px] font-medium tracking-[0.08em] text-text transition-colors duration-200',
                                    'hover:border-black/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                                    current
                                        ? 'border-black'
                                        : 'border-transparent',
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
