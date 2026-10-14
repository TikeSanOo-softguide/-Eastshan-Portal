import AdminPageHeader from '@/Components/admin/AdminPageHeader';
import DataTable from '@/Components/admin/DataTable';
import AdminLayout from '@/Layouts/AdminLayout';
import { adminHref } from '@/lib/navigation';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function Index({ filters = {}, articles = { data: [], meta: {}, links: {} } }) {
    const { t } = useTranslation();
    const { locale } = usePage().props;
    const base = adminHref('/admin/articles');
    const collection = articles ?? { data: [], meta: {}, links: {} };
    const display = (value) => value && typeof value === 'object' ? (value[locale] ?? value.en ?? Object.values(value)[0]) : value;
    const renderValue = (key, value) => {
        if (key.startsWith('is_')) return <span className={`rounded-full px-2 py-1 text-xs font-medium ${value ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>{value ? t('admin.datatable.yes') : t('admin.datatable.no')}</span>;
        if ((key.endsWith('_at') || key === 'updated_at') && value) return new Date(value).toLocaleDateString(locale);
        return display(value) ?? '—';
    };
    const columns = [
        { key: 'title', label: t('admin.form.title'), sortable: true, render: (row) => renderValue('title', row.title) },
        { key: 'category', label: t('admin.form.category'), sortable: false, render: (row) => renderValue('category', row.category) },
        { key: 'status', label: t('admin.form.status'), sortable: true, render: (row) => renderValue('status', row.status) },
        { key: 'author', label: t('admin.form.author'), sortable: false, render: (row) => renderValue('author', row.author) },
        { key: 'published_at', label: t('admin.form.published_at'), sortable: true, render: (row) => renderValue('published_at', row.published_at) },
        {
            key: 'actions',
            label: t('admin.datatable.actions'),
            render: (row) => <Link href={`${base}/${row.id}/edit`} className="inline-flex min-h-9 items-center gap-1 rounded-md px-2 text-navy-700 hover:bg-bg dark:text-gold-300"><Pencil className="size-4" />{t('admin.datatable.edit')}</Link>,
        },
    ];
    return (
        <>
            <Head title={t('admin.crud.article.index')} />
            <AdminPageHeader title={t('admin.crud.article.index')} />
            <DataTable
                columns={columns}
                rows={collection.data}
                filters={filters}
                pagination={{ ...collection.meta, ...collection.links }}
                endpoint={base}
                createHref={`${base}/create`}
                onBulkDelete={(ids) => router.post(`${base}/bulk-destroy`, { ids }, { preserveScroll: true })}
            />
        </>
    );
}
Index.layout = (page) => <AdminLayout>{page}</AdminLayout>;
export default Index;
