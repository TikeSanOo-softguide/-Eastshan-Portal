import AdminPageHeader from '@/Components/admin/AdminPageHeader';
import FormActions from '@/Components/admin/FormActions';
import FormField from '@/Components/admin/FormField';
import LocaleTabs from '@/Components/admin/LocaleTabs';
import PublishToggle from '@/Components/admin/PublishToggle';
import AdminLayout from '@/Layouts/AdminLayout';
import { adminHref } from '@/lib/navigation';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

function Form({ item, options = {} }) {
    const { t } = useTranslation(); const { locale } = usePage().props; const base = adminHref('/admin/news');
    const { data, setData, post, put, processing, errors } = useForm({ category_id: item?.category_id ?? '', title: item?.title ?? { en: '', my: '', zh: '' }, excerpt: item?.excerpt ?? { en: '', my: '', zh: '' }, source_name: item?.source_name ?? '', source_url: item?.source_url ?? '', is_published: item?.is_published ?? false, published_at: item?.published_at ?? '' });
    const trans = (field, lang, value) => setData(field, { ...data[field], [lang]: value });
    const submit = (e) => { e.preventDefault(); item ? put(`${base}/${item.id}`) : post(base); };
    return <><Head title={t(`admin.crud.news.${item ? 'edit' : 'create'}`)} /><AdminPageHeader title={t(`admin.crud.news.${item ? 'edit' : 'create'}`)} /><form onSubmit={submit} className="admin-panel mx-auto max-w-4xl space-y-6">
        <LocaleTabs>{(lang) => <div className="space-y-4"><FormField name={`title.${lang}`} label={t('admin.form.title')} value={data.title[lang] ?? ''} onChange={(e) => trans('title', lang, e.target.value)} error={errors[`title.${lang}`]} /><FormField name={`excerpt.${lang}`} as="textarea" rows={5} label={t('admin.form.excerpt')} value={data.excerpt[lang] ?? ''} onChange={(e) => trans('excerpt', lang, e.target.value)} error={errors[`excerpt.${lang}`]} /></div>}</LocaleTabs>
        <div className="grid gap-4 sm:grid-cols-2"><FormField name="category_id" as="select" label={t('admin.form.category')} value={data.category_id} onChange={(e) => setData('category_id', e.target.value)}>{options.categories?.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</FormField><FormField name="source_name" label={t('admin.form.source_name')} value={data.source_name} onChange={(e) => setData('source_name', e.target.value)} /><FormField name="source_url" type="url" label={t('admin.form.source_url')} value={data.source_url} onChange={(e) => setData('source_url', e.target.value)} /><FormField name="published_at" type="datetime-local" label={t('admin.form.published_at')} value={data.published_at} onChange={(e) => setData('published_at', e.target.value)} /></div>
        <PublishToggle checked={data.is_published} onChange={(value) => setData('is_published', value)} /><FormActions cancelHref={base} processing={processing} />
    </form></>;
}
Form.layout = (page) => <AdminLayout>{page}</AdminLayout>; export default Form;
