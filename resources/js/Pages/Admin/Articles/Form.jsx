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

function Form({ article, options = {} }) {
    const { t } = useTranslation(); const { locale } = usePage().props; const base = adminHref('/admin/articles');
    const { data, setData, post, transform, processing, errors } = useForm({ category: article?.category ?? options.categories?.[0]?.value ?? '', slug: article?.slug ?? '', title: article?.title ?? { en: '', my: '', zh: '' }, body: article?.body ?? { en: '', my: '', zh: '' }, cover: article?.cover ?? null, status: article?.status ?? options.statuses?.[0]?.value ?? 'draft', published_at: article?.published_at ?? '', author_id: article?.author_id ?? '' });
    const trans = (field, lang, value) => setData(field, { ...data[field], [lang]: value });
    const submit = (e) => { e.preventDefault(); transform((values) => ({ ...values, cover: values.cover instanceof File ? values.cover : null, ...(article ? { _method: 'put' } : {}) })); post(article ? `${base}/${article.id}` : base, { forceFormData: true }); };
    return <><Head title={t(`admin.crud.article.${article ? 'edit' : 'create'}`)} /><AdminPageHeader title={t(`admin.crud.article.${article ? 'edit' : 'create'}`)} /><form onSubmit={submit} className="admin-panel mx-auto max-w-5xl space-y-6">
        <LocaleTabs>{(lang) => <div className="space-y-4"><FormField name={`title.${lang}`} label={t('admin.form.title')} value={data.title[lang] ?? ''} onChange={(e) => trans('title', lang, e.target.value)} error={errors[`title.${lang}`]} /><RichTextEditor label={t('admin.form.body')} value={data.body[lang] ?? ''} onChange={(value) => trans('body', lang, value)} error={errors[`body.${lang}`]} /></div>}</LocaleTabs>
        <div className="grid gap-4 sm:grid-cols-2"><FormField name="category" as="select" label={t('admin.form.category')} value={data.category} onChange={(e) => setData('category', e.target.value)}>{options.categories?.map((row) => <option key={row.value} value={row.value}>{row.label}</option>)}</FormField><FormField name="status" as="select" label={t('admin.form.status')} value={data.status} onChange={(e) => setData('status', e.target.value)}>{options.statuses?.map((row) => <option key={row.value} value={row.value}>{row.label}</option>)}</FormField><FormField name="slug" label={t('admin.form.slug')} value={data.slug} onChange={(e) => setData('slug', e.target.value)} /><FormField name="published_at" type="datetime-local" label={t('admin.form.published_at')} value={data.published_at} onChange={(e) => setData('published_at', e.target.value)} /></div>
        <ImageUpload label={t('admin.form.cover')} value={data.cover} onChange={(file) => setData('cover', file)} error={errors.cover} />
        <PublishToggle checked={data.status === 'published'} onChange={(published) => setData('status', published ? 'published' : 'draft')} />
        <FormActions cancelHref={base} processing={processing} />
    </form></>;
}
Form.layout = (page) => <AdminLayout>{page}</AdminLayout>; export default Form;
