import AdminPageHeader from '@/Components/admin/AdminPageHeader';
import DataTable from '@/Components/admin/DataTable';
import AdminLayout from '@/Layouts/AdminLayout';
import { adminHref } from '@/lib/navigation';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function Index({ filters = {}, leaders = { data: [], meta: {}, links: {} } }) {
    const { t } = useTranslation();
    const { locale } = usePage().props;
    const base = adminHref('/admin/leaders');
    const collection = leaders ?? { data: [], meta: {}, links: {} };
    const display = (value) => value && typeof value === 'object' ? (value[locale] ?? value.en ?? Object.values(value)[0]) : value;
    const renderValue = (key, value) => {
        if (key.startsWith('is_')) return <span className={`rounded-full px-2 py-1 text-xs font-medium ${value ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>{value ? t('admin.datatable.yes') : t('admin.datatable.no')}</span>;
        if ((key.endsWith('_at') || key === 'updated_at') && value) return new Date(value).toLocaleDateString(locale);
        return display(value) ?? '—';
    };
    const columns = [
        { key: 'name', label: t('admin.form.name'), sortable: true, render: (row) => renderValue('name', row.name) },
        { key: 'position', label: t('admin.form.position'), sortable: false, render: (row) => renderValue('position', row.position) },
        { key: 'institution', label: t('admin.form.institution'), sortable: false, render: (row) => renderValue('institution', row.institution) },
        { key: 'updated_at', label: t('admin.form.updated_at'), sortable: true, render: (row) => renderValue('updated_at', row.updated_at) },
        {
            key: 'actions',
            label: t('admin.datatable.actions'),
            render: (row) => <Link href={`${base}/${row.id}/edit`} className="inline-flex min-h-9 items-center gap-1 rounded-md px-2 text-navy-700 hover:bg-bg dark:text-gold-300"><Pencil className="size-4" />{t('admin.datatable.edit')}</Link>,
        },
    ];
    return (
        <>
            <Head title={t('admin.crud.leader.index')} />
            <AdminPageHeader title={t('admin.crud.leader.index')} />
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
