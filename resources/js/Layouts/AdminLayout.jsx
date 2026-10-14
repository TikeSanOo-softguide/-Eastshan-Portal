import FlashToasts from '@/Components/admin/FlashToasts';
import ThemeToggle from '@/Components/admin/ThemeToggle';
import LanguageSwitcher from '@/Components/public/LanguageSwitcher';
import { adminHref, localizedHref } from '@/lib/navigation';
import { Link, router, usePage } from '@inertiajs/react';
import {
    Building2, ChevronLeft, ChevronRight, FileText, Gauge, Landmark, LogOut,
    Menu, Newspaper, Search, UserCircle, Users, X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const SIDEBAR_KEY = 'eastshan-admin-sidebar';
const nav = [
    ['dashboard', '/admin', 'view dashboard', Gauge],
    ['institutions', '/admin/institutions', 'manage institutions', Building2],
    ['leaders', '/admin/leaders', 'manage leaders', Users],
    ['townships', '/admin/townships', 'manage townships', Landmark],
    ['contentPages', '/admin/content-pages', 'manage content pages', FileText],
    ['infrastructure', '/admin/infrastructure', 'manage infrastructure', Building2],
    ['news', '/admin/news', 'manage news', Newspaper],
    ['articles', '/admin/articles', 'manage articles', FileText],
];

export default function AdminLayout({ children }) {
    const { t } = useTranslation();
    const { props, url } = usePage();
    const { auth = {}, flash = {}, locale = 'en' } = props;
    const permissions = auth.user?.permissions ?? [];
    const [collapsed, setCollapsed] = useState(() => localStorage.getItem(SIDEBAR_KEY) === 'collapsed');
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userOpen, setUserOpen] = useState(false);
    const [search, setSearch] = useState('');
    const userRef = useRef(null);
    const items = useMemo(() => nav.filter(([, , permission]) => permissions.includes(permission)), [permissions]);

    useEffect(() => setMobileOpen(false), [url]);
    useEffect(() => {
        const close = (event) => !userRef.current?.contains(event.target) && setUserOpen(false);
        document.addEventListener('pointerdown', close);
        return () => document.removeEventListener('pointerdown', close);
    }, []);

    const toggleCollapsed = () => {
        setCollapsed((current) => {
            localStorage.setItem(SIDEBAR_KEY, current ? 'expanded' : 'collapsed');
            return !current;
        });
    };
    const searchTarget = permissions.includes('manage news') ? '/admin/news' : '/admin/institutions';
    const submitSearch = (event) => {
        event.preventDefault();
        router.get(adminHref(searchTarget), { q: search });
    };

    const sidebar = (
        <div className="flex h-full flex-col bg-navy-950 text-slate-100">
            <div className="flex min-h-16 items-center gap-3 border-b border-white/10 px-4">
                <Link href={adminHref('/admin')} className="min-w-0 flex-1 font-semibold">
                    {collapsed ? 'ES' : t('common.appName')}
                </Link>
                <button type="button" onClick={() => setMobileOpen(false)} className="lg:hidden"><X className="size-5" /></button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label={t('admin.sidebar.navigation')}>
                {items.map(([key, href, , Icon]) => {
                    const localized = adminHref(href);
                    const active = href === '/admin' ? url.split('?')[0] === localized : url.startsWith(localized);
                    return (
                        <Link key={key} href={localized} title={collapsed ? t(`admin.nav.${key}`) : undefined} className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium ${active ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}>
                            <Icon className="size-5 shrink-0" />
                            {!collapsed ? <span>{t(`admin.nav.${key}`)}</span> : null}
                        </Link>
                    );
                })}
            </nav>
            <button type="button" onClick={toggleCollapsed} className="hidden min-h-12 items-center justify-center border-t border-white/10 text-slate-300 hover:bg-white/10 hover:text-white lg:flex" aria-label={t('admin.sidebar.toggle')}>
                {collapsed ? <ChevronRight className="size-5" /> : <ChevronLeft className="size-5" />}
            </button>
        </div>
    );

    return (
        <div className="admin-shell min-h-screen bg-bg text-text">
            <aside className={`fixed inset-y-0 start-0 z-50 hidden transition-[width] duration-200 lg:block ${collapsed ? 'w-20' : 'w-64'}`}>{sidebar}</aside>
            {mobileOpen ? <><button type="button" className="fixed inset-0 z-40 bg-navy-950/60 lg:hidden" onClick={() => setMobileOpen(false)} aria-label={t('nav.closeMenu')} /><aside className="fixed inset-y-0 start-0 z-50 w-72 lg:hidden">{sidebar}</aside></> : null}
            <div className={`transition-[margin] duration-200 ${collapsed ? 'lg:ms-20' : 'lg:ms-64'}`}>
                <header className="sticky top-0 z-30 flex min-h-16 items-center gap-3 border-b border-border bg-surface/95 px-4 backdrop-blur sm:px-6">
                    <button type="button" onClick={() => setMobileOpen(true)} className="admin-icon-button lg:hidden" aria-label={t('nav.openMenu')}><Menu className="size-5" /></button>
                    <form onSubmit={submitSearch} className="relative hidden min-w-40 max-w-md flex-1 md:block">
                        <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
                        <input value={search} onChange={(e) => setSearch(e.target.value)} className="admin-input ps-9" placeholder={t('admin.topbar.search')} aria-label={t('admin.topbar.search')} />
                    </form>
                    <div className="ms-auto flex items-center gap-2">
                        <LanguageSwitcher mode="admin" />
                        <ThemeToggle />
                        <div ref={userRef} className="relative">
                            <button type="button" onClick={() => setUserOpen((open) => !open)} className="admin-icon-button" aria-expanded={userOpen} aria-label={t('admin.topbar.userMenu')}><UserCircle className="size-5" /></button>
                            {userOpen ? (
                                <div className="absolute end-0 mt-2 w-56 rounded-lg border border-border bg-surface p-2 shadow-xl">
                                    <div className="border-b border-border px-3 py-2"><p className="truncate text-sm font-medium text-text">{auth.user?.name}</p><p className="truncate text-xs text-muted">{auth.user?.email}</p></div>
                                    <Link href={localizedHref(locale, '/profile')} className="mt-1 flex min-h-10 items-center gap-2 rounded-md px-3 text-sm text-text hover:bg-bg"><UserCircle className="size-4" />{t('nav.profile')}</Link>
                                    <button type="button" onClick={() => router.post(localizedHref(locale, '/logout'))} className="flex min-h-10 w-full items-center gap-2 rounded-md px-3 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"><LogOut className="size-4" />{t('nav.logout')}</button>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </header>
                <main id="main" className="p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
            <FlashToasts flash={flash} />
        </div>
    );
}
