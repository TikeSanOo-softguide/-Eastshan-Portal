import AdminPageHeader from '@/Components/admin/AdminPageHeader';
import FormActions from '@/Components/admin/FormActions';
import FormField from '@/Components/admin/FormField';
import ImageUpload from '@/Components/admin/ImageUpload';
import LocaleTabs from '@/Components/admin/LocaleTabs';
import PublishToggle from '@/Components/admin/PublishToggle';
import RichTextEditor from '@/Components/admin/RichTextEditor';
import AdminLayout from '@/Layouts/AdminLayout';
import { adminHref } from '@/lib/navigation';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

function Form({ page, options = {} }) {
    const { t } = useTranslation(); const { locale } = usePage().props; const base = adminHref('/admin/content-pages');
    const { data, setData, post, transform, processing, errors } = useForm({ section: page?.section ?? options.sections?.[0]?.value ?? '', slug: page?.slug ?? '', title: page?.title ?? { en: '', my: '', zh: '' }, body: page?.body ?? { en: '', my: '', zh: '' }, cover: page?.cover ?? null, is_published: page?.is_published ?? false, sort_order: page?.sort_order ?? 0 });
    const trans = (field, lang, value) => setData(field, { ...data[field], [lang]: value });
    const submit = (e) => { e.preventDefault(); transform((values) => ({ ...values, cover: values.cover instanceof File ? values.cover : null, ...(page ? { _method: 'put' } : {}) })); post(page ? `${base}/${page.id}` : base, { forceFormData: true }); };
    return <><Head title={t(`admin.crud.page.${page ? 'edit' : 'create'}`)} /><AdminPageHeader title={t(`admin.crud.page.${page ? 'edit' : 'create'}`)} /><form onSubmit={submit} className="admin-panel mx-auto max-w-5xl space-y-6">
        <LocaleTabs>{(lang) => <div className="space-y-4"><FormField name={`title.${lang}`} label={t('admin.form.title')} value={data.title[lang] ?? ''} onChange={(e) => trans('title', lang, e.target.value)} error={errors[`title.${lang}`]} /><RichTextEditor label={t('admin.form.body')} value={data.body[lang] ?? ''} onChange={(value) => trans('body', lang, value)} error={errors[`body.${lang}`]} /></div>}</LocaleTabs>
        <div className="grid gap-4 sm:grid-cols-3"><FormField name="section" as="select" label={t('admin.form.section')} value={data.section} onChange={(e) => setData('section', e.target.value)}>{options.sections?.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</FormField><FormField name="slug" label={t('admin.form.slug')} value={data.slug} onChange={(e) => setData('slug', e.target.value)} /><FormField name="sort_order" type="number" label={t('admin.form.sort_order')} value={data.sort_order} onChange={(e) => setData('sort_order', e.target.value)} /></div>
        <ImageUpload label={t('admin.form.cover')} value={data.cover} onChange={(file) => setData('cover', file)} error={errors.cover} /><PublishToggle checked={data.is_published} onChange={(value) => setData('is_published', value)} /><FormActions cancelHref={base} processing={processing} />
    </form></>;
}
Form.layout = (page) => <AdminLayout>{page}</AdminLayout>; export default Form;
