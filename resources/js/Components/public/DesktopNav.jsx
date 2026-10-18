import { cx } from '@/lib/cx';
import {
    branchIsCurrent,
    localizedHref,
    navigation,
} from '@/lib/navigation';
import { Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

function itemClass(active, inverse) {
    return cx(
        'inline-flex min-h-10 shrink-0 items-center whitespace-nowrap rounded-[8px] px-4 py-2.5 text-[13px] font-normal uppercase tracking-[0.15em] transition-colors duration-200',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        inverse
            ? active
                ? 'bg-white/15 text-white'
                : 'text-white hover:bg-white/10'
            : active
              ? 'bg-navy-900/10 text-navy-900'
              : 'text-text/80 hover:text-navy-900',
    );
}

export default function DesktopNav({ className = '', tone = 'default' }) {
    const { t } = useTranslation();
    const page = usePage();
    const locale = page.props.locale ?? 'my';
    const inverse = tone === 'inverse';

    return (
        <nav
            aria-label={t('nav.primaryLabel')}
            className={cx(
                'hidden self-stretch lg:flex lg:items-center',
                className,
            )}
        >
            <ul className="flex w-full flex-wrap items-center justify-center gap-x-1 gap-y-0">
                {navigation.map((item) => {
                    const current = branchIsCurrent(page.url, locale, item);

                    return (
                        <li key={item.key}>
                            <Link
                                href={localizedHref(locale, item.href)}
                                className={itemClass(current, inverse)}
                                aria-current={current ? 'page' : undefined}
                            >
                                {t(item.key)}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
