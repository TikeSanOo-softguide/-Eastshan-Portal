import AdminPageHeader from '@/Components/admin/AdminPageHeader';
import FormActions from '@/Components/admin/FormActions';
import FormField from '@/Components/admin/FormField';
import ImageUpload from '@/Components/admin/ImageUpload';
import LocaleTabs from '@/Components/admin/LocaleTabs';
import PublishToggle from '@/Components/admin/PublishToggle';
import AdminLayout from '@/Layouts/AdminLayout';
import { adminHref } from '@/lib/navigation';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

function Form({ institution, options = {} }) {
    const { t } = useTranslation();
    const { locale } = usePage().props;
    const base = adminHref('/admin/institutions');
    const { data, setData, post, transform, processing, errors } = useForm({
        parent_id: institution?.parent_id ?? '', type: institution?.type ?? options.types?.[0]?.value ?? '',
        name: institution?.name ?? { en: '', my: '', zh: '' }, description: institution?.description ?? { en: '', my: '', zh: '' },
        slug: institution?.slug ?? '', address: institution?.address ?? '', phone: institution?.phone ?? '',
        email: institution?.email ?? '', logo: institution?.logo ?? null, sort_order: institution?.sort_order ?? 0,
        is_active: institution?.is_active ?? true,
    });
    const trans = (field, lang, value) => setData(field, { ...data[field], [lang]: value });
    const submit = (event) => { event.preventDefault(); transform((values) => ({ ...values, logo: values.logo instanceof File ? values.logo : null, ...(institution ? { _method: 'put' } : {}) })); post(institution ? `${base}/${institution.id}` : base, { forceFormData: true }); };
    return (
        <>
            <Head title={t(`admin.crud.institution.${institution ? 'edit' : 'create'}`)} />
            <AdminPageHeader title={t(`admin.crud.institution.${institution ? 'edit' : 'create'}`)} />
            <form onSubmit={submit} className="admin-panel mx-auto max-w-4xl space-y-6">
                <LocaleTabs>{(lang) => <div className="space-y-4"><FormField name={`name.${lang}`} label={t('admin.form.name')} value={data.name[lang] ?? ''} onChange={(e) => trans('name', lang, e.target.value)} error={errors[`name.${lang}`]} /><FormField name={`description.${lang}`} as="textarea" rows={5} label={t('admin.form.description')} value={data.description[lang] ?? ''} onChange={(e) => trans('description', lang, e.target.value)} error={errors[`description.${lang}`]} /></div>}</LocaleTabs>
                <div className="grid gap-4 sm:grid-cols-2"><FormField name="slug" label={t('admin.form.slug')} value={data.slug} onChange={(e) => setData('slug', e.target.value)} /><FormField name="type" as="select" label={t('admin.form.type')} value={data.type} onChange={(e) => setData('type', e.target.value)}>{options.types?.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</FormField><FormField name="parent_id" as="select" label={t('admin.form.parent')} value={data.parent_id} onChange={(e) => setData('parent_id', e.target.value)}><option value="">{t('admin.form.none')}</option>{options.parents?.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</FormField><FormField name="sort_order" type="number" label={t('admin.form.sort_order')} value={data.sort_order} onChange={(e) => setData('sort_order', e.target.value)} /><FormField name="address" label={t('admin.form.address')} value={data.address} onChange={(e) => setData('address', e.target.value)} /><FormField name="phone" label={t('admin.form.phone')} value={data.phone} onChange={(e) => setData('phone', e.target.value)} /><FormField name="email" type="email" label={t('admin.form.email')} value={data.email} onChange={(e) => setData('email', e.target.value)} /></div>
                <ImageUpload label={t('admin.form.logo')} value={data.logo} onChange={(file) => setData('logo', file)} error={errors.logo} />
                <PublishToggle label={t('admin.form.active')} checked={data.is_active} onChange={(value) => setData('is_active', value)} />
                <FormActions cancelHref={base} processing={processing} />
            </form>
        </>
    );
}
Form.layout = (page) => <AdminLayout>{page}</AdminLayout>;
export default Form;
