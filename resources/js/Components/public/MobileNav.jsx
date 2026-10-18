import { cx } from '@/lib/cx';
import {
    branchIsCurrent,
    isCurrentHref,
    localizedHref,
    navigation,
} from '@/lib/navigation';
import {
    motionTransition,
    usePrefersReducedMotion,
} from '@/lib/usePrefersReducedMotion';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useId, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function listFocusable(root) {
    return [...root.querySelectorAll(FOCUSABLE)].filter(
        (element) => element.getClientRects().length > 0,
    );
}

export default function MobileNav({ id, open, onClose }) {
    const { t } = useTranslation();
    const page = usePage();
    const locale = page.props.locale ?? 'my';
    const reduced = usePrefersReducedMotion();
    const panelRef = useRef(null);
    const titleId = useId();

    useEffect(() => {
        if (!open) {
            return undefined;
        }

        const desktop = window.matchMedia('(min-width: 1024px)');

        if (desktop.matches) {
            onClose();

            return undefined;
        }

        const onViewport = () => {
            if (desktop.matches) {
                onClose();
            }
        };

        desktop.addEventListener('change', onViewport);

        const shell = document.getElementById('public-shell');
        const panel = panelRef.current;
        const previouslyFocused = document.activeElement;
        const previousOverflow = document.body.style.overflow;

        if (shell) {
            shell.inert = true;
        }

        document.body.style.overflow = 'hidden';
        panel?.querySelector('[data-autofocus]')?.focus();

        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onClose();

                return;
            }

            if (event.key !== 'Tab' || !panel) {
                return;
            }

            const items = listFocusable(panel);

            if (items.length === 0) {
                event.preventDefault();

                return;
            }

            const first = items[0];
            const last = items[items.length - 1];
            const active = document.activeElement;

            if (
                event.shiftKey &&
                (active === first || !panel.contains(active))
            ) {
                event.preventDefault();
                last.focus();
            } else if (
                !event.shiftKey &&
                (active === last || !panel.contains(active))
            ) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener('keydown', onKeyDown);

        return () => {
            desktop.removeEventListener('change', onViewport);
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = previousOverflow;

            if (shell) {
                shell.inert = false;
            }

            if (previouslyFocused instanceof HTMLElement) {
                previouslyFocused.focus();
            }
        };
    }, [open, onClose]);

    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 lg:hidden">
            <div
                className="absolute inset-0 bg-navy-900/50"
                onClick={onClose}
                aria-hidden="true"
            />
            <motion.div
                ref={panelRef}
                id={id}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                data-testid="mobile-drawer"
                initial={reduced ? false : { opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={motionTransition(reduced)}
                className="absolute inset-y-0 end-0 flex w-[min(20rem,calc(100%-2.5rem))] flex-col bg-surface text-text shadow-md"
            >
                <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2">
                    <p id={titleId} className="font-display text-lg">
                        {t('nav.menu')}
                    </p>
                    <button
                        type="button"
                        data-autofocus="true"
                        className={cx(
                            'inline-flex min-h-11 min-w-11 items-center justify-center',
                            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                        )}
                        aria-label={t('nav.closeMenu')}
                        onClick={onClose}
                    >
                        <X className="size-5" aria-hidden="true" />
                    </button>
                </div>

                <nav
                    aria-label={t('nav.primaryLabel')}
                    className="overflow-y-auto px-4 py-2"
                >
                    <ul>
                        {navigation.map((item) => {
                            const current = branchIsCurrent(
                                page.url,
                                locale,
                                item,
                            );

                            return (
                                <li key={item.key}>
                                    <Link
                                        href={localizedHref(locale, item.href)}
                                        className={cx(
                                            'flex min-h-11 items-center text-[13px] font-normal uppercase tracking-[0.15em]',
                                            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                                            current
                                                ? 'text-navy-900'
                                                : 'text-text/80',
                                        )}
                                        aria-current={
                                            current ? 'page' : undefined
                                        }
                                        onClick={onClose}
                                    >
                                        {t(item.key)}
                                    </Link>
                                    {item.children ? (
                                        <ul className="mb-2 flex flex-wrap gap-1 pb-2 ps-1">
                                            {item.children.map((child) => {
                                                const childCurrent =
                                                    isCurrentHref(
                                                        page.url,
                                                        locale,
                                                        child.href,
                                                    );

                                                return (
                                                    <li key={child.key}>
                                                        <Link
                                                            href={localizedHref(
                                                                locale,
                                                                child.href,
                                                            )}
                                                            className={cx(
                                                                'inline-flex items-center px-3 py-2 text-[12px] font-normal uppercase tracking-[0.15em]',
                                                                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                                                                childCurrent
                                                                    ? 'bg-navy-900 text-white'
                                                                    : 'text-text/80 hover:text-navy-900',
                                                            )}
                                                            aria-current={
                                                                childCurrent
                                                                    ? 'page'
                                                                    : undefined
                                                            }
                                                            onClick={onClose}
                                                        >
                                                            {t(child.key)}
                                                        </Link>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    ) : null}
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </motion.div>
        </div>
    );
}
