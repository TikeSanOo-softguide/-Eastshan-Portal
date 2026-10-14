import AdminPageHeader from '@/Components/admin/AdminPageHeader';
import FormActions from '@/Components/admin/FormActions';
import FormField from '@/Components/admin/FormField';
import ImageUpload from '@/Components/admin/ImageUpload';
import LocaleTabs from '@/Components/admin/LocaleTabs';
import AdminLayout from '@/Layouts/AdminLayout';
import { adminHref } from '@/lib/navigation';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

function Form({ leader, options = {} }) {
    const { t } = useTranslation(); const { locale } = usePage().props; const base = adminHref('/admin/leaders');
    const { data, setData, post, transform, processing, errors } = useForm({ institution_id: leader?.institution_id ?? '', name: leader?.name ?? { en: '', my: '', zh: '' }, position: leader?.position ?? { en: '', my: '', zh: '' }, bio: leader?.bio ?? { en: '', my: '', zh: '' }, photo: leader?.photo ?? null, sort_order: leader?.sort_order ?? 0 });
    const trans = (field, lang, value) => setData(field, { ...data[field], [lang]: value });
    const submit = (e) => { e.preventDefault(); transform((values) => ({ ...values, photo: values.photo instanceof File ? values.photo : null, ...(leader ? { _method: 'put' } : {}) })); post(leader ? `${base}/${leader.id}` : base, { forceFormData: true }); };
    return <><Head title={t(`admin.crud.leader.${leader ? 'edit' : 'create'}`)} /><AdminPageHeader title={t(`admin.crud.leader.${leader ? 'edit' : 'create'}`)} /><form onSubmit={submit} className="admin-panel mx-auto max-w-4xl space-y-6">
        <LocaleTabs>{(lang) => <div className="space-y-4"><FormField name={`name.${lang}`} label={t('admin.form.name')} value={data.name[lang] ?? ''} onChange={(e) => trans('name', lang, e.target.value)} error={errors[`name.${lang}`]} /><FormField name={`position.${lang}`} label={t('admin.form.position')} value={data.position[lang] ?? ''} onChange={(e) => trans('position', lang, e.target.value)} error={errors[`position.${lang}`]} /><FormField name={`bio.${lang}`} as="textarea" rows={5} label={t('admin.form.bio')} value={data.bio[lang] ?? ''} onChange={(e) => trans('bio', lang, e.target.value)} error={errors[`bio.${lang}`]} /></div>}</LocaleTabs>
        <div className="grid gap-4 sm:grid-cols-2"><FormField name="institution_id" as="select" label={t('admin.form.institution')} value={data.institution_id} onChange={(e) => setData('institution_id', e.target.value)}>{options.institutions?.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</FormField><FormField name="sort_order" type="number" label={t('admin.form.sort_order')} value={data.sort_order} onChange={(e) => setData('sort_order', e.target.value)} /></div>
        <ImageUpload label={t('admin.form.photo')} value={data.photo} onChange={(file) => setData('photo', file)} error={errors.photo} /><FormActions cancelHref={base} processing={processing} />
    </form></>;
}
Form.layout = (page) => <AdminLayout>{page}</AdminLayout>; export default Form;
