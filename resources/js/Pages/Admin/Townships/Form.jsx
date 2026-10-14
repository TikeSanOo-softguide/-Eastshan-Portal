import AdminPageHeader from '@/Components/admin/AdminPageHeader';
import FormActions from '@/Components/admin/FormActions';
import FormField from '@/Components/admin/FormField';
import LocaleTabs from '@/Components/admin/LocaleTabs';
import AdminLayout from '@/Layouts/AdminLayout';
import { adminHref } from '@/lib/navigation';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

function Form({ township }) {
    const { t } = useTranslation(); const { locale } = usePage().props; const base = adminHref('/admin/townships');
    const { data, setData, post, put, processing, errors } = useForm({ name: township?.name ?? { en: '', my: '', zh: '' }, slug: township?.slug ?? '', population: township?.population ?? '', area_km2: township?.area_km2 ?? '', lat: township?.lat ?? '', lng: township?.lng ?? '', sort_order: township?.sort_order ?? 0 });
    const submit = (e) => { e.preventDefault(); township ? put(`${base}/${township.id}`) : post(base); };
    return <><Head title={t(`admin.crud.township.${township ? 'edit' : 'create'}`)} /><AdminPageHeader title={t(`admin.crud.township.${township ? 'edit' : 'create'}`)} /><form onSubmit={submit} className="admin-panel mx-auto max-w-4xl space-y-6">
        <LocaleTabs>{(lang) => <FormField name={`name.${lang}`} label={t('admin.form.name')} value={data.name[lang] ?? ''} onChange={(e) => setData('name', { ...data.name, [lang]: e.target.value })} error={errors[`name.${lang}`]} />}</LocaleTabs>
        <div className="grid gap-4 sm:grid-cols-2"><FormField name="slug" label={t('admin.form.slug')} value={data.slug} onChange={(e) => setData('slug', e.target.value)} /><FormField name="population" type="number" label={t('admin.form.population')} value={data.population} onChange={(e) => setData('population', e.target.value)} /><FormField name="area_km2" type="number" step="any" label={t('admin.form.area_km2')} value={data.area_km2} onChange={(e) => setData('area_km2', e.target.value)} /><FormField name="lat" type="number" step="any" label={t('admin.form.lat')} value={data.lat} onChange={(e) => setData('lat', e.target.value)} /><FormField name="lng" type="number" step="any" label={t('admin.form.lng')} value={data.lng} onChange={(e) => setData('lng', e.target.value)} /><FormField name="sort_order" type="number" label={t('admin.form.sort_order')} value={data.sort_order} onChange={(e) => setData('sort_order', e.target.value)} /></div>
        <FormActions cancelHref={base} processing={processing} />
    </form></>;
}
Form.layout = (page) => <AdminLayout>{page}</AdminLayout>; export default Form;
