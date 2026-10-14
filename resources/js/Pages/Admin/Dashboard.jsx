import AdminPageHeader from '@/Components/admin/AdminPageHeader';
import PublishedChart from '@/Components/admin/PublishedChart';
import StatCard from '@/Components/admin/StatCard';
import AdminLayout from '@/Layouts/AdminLayout';
import { adminHref } from '@/lib/navigation';
import { Head, Link, usePage } from '@inertiajs/react';
import { Activity, ArrowRight, BarChart3, Building2, FileText, Newspaper, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const icons = { institutions: Building2, leaders: Users, news: Newspaper, articles: FileText, published_news: BarChart3, published_articles: BarChart3 };

function Dashboard({ stats = [], chart = [], activity = [], quickActions = [] }) {
    const { t } = useTranslation();
    const { locale } = usePage().props;
    const localize = (href) => adminHref(href);
    return (
        <>
            <Head title={t('admin.dashboardTitle')} />
            <AdminPageHeader title={t('admin.dashboardTitle')} description={t('admin.dashboardDescription')} />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => <StatCard key={stat.key} {...stat} label={t(stat.label)} href={localize(stat.href)} icon={icons[stat.key]} />)}
            </div>
            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
                <PublishedChart data={chart} />
                <section className="admin-panel">
                    <h2 className="text-base font-semibold text-text">{t('admin.quick.title')}</h2>
                    <div className="mt-4 grid gap-2">
                        {quickActions.map((action) => <Link key={action.href} href={localize(action.href)} className="flex min-h-11 items-center justify-between rounded-lg border border-border px-3 text-sm font-medium text-text hover:bg-bg">{t(action.label)}<ArrowRight className="size-4 text-muted" /></Link>)}
                    </div>
                </section>
            </div>
            <section className="admin-panel mt-6">
                <h2 className="flex items-center gap-2 text-base font-semibold text-text"><Activity className="size-5" />{t('admin.activity.title')}</h2>
                <div className="mt-4 divide-y divide-border">
                    {activity.map((item, index) => <Link key={`${item.type}-${index}`} href={localize(item.href)} className="flex items-center justify-between gap-4 py-3 text-sm hover:text-navy-600 dark:hover:text-gold-300"><span className="truncate">{item.title}</span><time className="shrink-0 text-xs text-muted">{item.at ? new Date(item.at).toLocaleDateString(locale) : ''}</time></Link>)}
                    {!activity.length ? <p className="py-6 text-sm text-muted">{t('admin.activity.empty')}</p> : null}
                </div>
            </section>
        </>
    );
}

Dashboard.layout = (page) => <AdminLayout>{page}</AdminLayout>;
export default Dashboard;
