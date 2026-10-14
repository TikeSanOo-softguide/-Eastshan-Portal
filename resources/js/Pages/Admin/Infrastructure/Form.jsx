import AdminPageHeader from '@/Components/admin/AdminPageHeader';
import FormActions from '@/Components/admin/FormActions';
import FormField from '@/Components/admin/FormField';
import LocaleTabs from '@/Components/admin/LocaleTabs';
import AdminLayout from '@/Layouts/AdminLayout';
import { adminHref } from '@/lib/navigation';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

function Form({ item, options = {} }) {
    const { t } = useTranslation(); const { locale } = usePage().props; const base = adminHref('/admin/infrastructure');
    const { data, setData, post, put, processing, errors } = useForm({ township_id: item?.township_id ?? '', category: item?.category ?? options.categories?.[0]?.value ?? '', name: item?.name ?? { en: '', my: '', zh: '' }, status: item?.status ?? options.statuses?.[0]?.value ?? '', stats: item?.stats ?? {}, year: item?.year ?? '', sort_order: item?.sort_order ?? 0 });
    const submit = (e) => { e.preventDefault(); item ? put(`${base}/${item.id}`) : post(base); };
    return <><Head title={t(`admin.crud.infrastructure.${item ? 'edit' : 'create'}`)} /><AdminPageHeader title={t(`admin.crud.infrastructure.${item ? 'edit' : 'create'}`)} /><form onSubmit={submit} className="admin-panel mx-auto max-w-4xl space-y-6">
        <LocaleTabs>{(lang) => <FormField name={`name.${lang}`} label={t('admin.form.name')} value={data.name[lang] ?? ''} onChange={(e) => setData('name', { ...data.name, [lang]: e.target.value })} error={errors[`name.${lang}`]} />}</LocaleTabs>
        <div className="grid gap-4 sm:grid-cols-2"><FormField name="township_id" as="select" label={t('admin.form.township')} value={data.township_id} onChange={(e) => setData('township_id', e.target.value)}>{options.townships?.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</FormField><FormField name="category" as="select" label={t('admin.form.category')} value={data.category} onChange={(e) => setData('category', e.target.value)}>{options.categories?.map((row) => <option key={row.value} value={row.value}>{row.label}</option>)}</FormField><FormField name="status" as="select" label={t('admin.form.status')} value={data.status} onChange={(e) => setData('status', e.target.value)}>{options.statuses?.map((row) => <option key={row.value} value={row.value}>{row.label}</option>)}</FormField><FormField name="year" type="number" label={t('admin.form.year')} value={data.year} onChange={(e) => setData('year', e.target.value)} /><FormField name="sort_order" type="number" label={t('admin.form.sort_order')} value={data.sort_order} onChange={(e) => setData('sort_order', e.target.value)} /><FormField name="stats" label={t('admin.form.stats')} value={Object.entries(data.stats).map(([key, value]) => `${key}:${value}`).join(', ')} onChange={(e) => setData('stats', Object.fromEntries(e.target.value.split(',').map((part) => part.split(':').map((value) => value.trim())).filter((pair) => pair.length === 2 && pair[0])))} /></div>
        <FormActions cancelHref={base} processing={processing} />
    </form></>;
}
Form.layout = (page) => <AdminLayout>{page}</AdminLayout>; export default Form;
