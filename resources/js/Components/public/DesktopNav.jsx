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
        'inline-flex min-h-11 shrink-0 items-center gap-1 whitespace-nowrap border-b px-3 text-[18px] font-medium tracking-[0.08em]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        inverse ? 'text-white' : 'text-text',
        active
            ? 'border-accent'
            : inverse
              ? 'border-transparent hover:border-white/80'
              : 'border-transparent hover:border-accent',
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
            <ul className="flex w-full items-center justify-center gap-1 overflow-x-auto">
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
