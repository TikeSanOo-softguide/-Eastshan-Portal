import ConfirmDialog from '@/Components/admin/ConfirmDialog';
import { Link, router } from '@inertiajs/react';
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function DataTable({ columns, rows = [], filters = {}, pagination = {}, endpoint, createHref, onBulkDelete, getRowId = (row) => row.id }) {
    const { t } = useTranslation();
    const [query, setQuery] = useState(filters.q ?? '');
    const [selected, setSelected] = useState([]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const ids = useMemo(() => rows.map(getRowId), [rows, getRowId]);
    const allSelected = ids.length > 0 && ids.every((id) => selected.includes(id));

    useEffect(() => setSelected([]), [rows]);

    const visit = (params) => router.get(endpoint, { ...filters, ...params }, { preserveState: true, replace: true });
    const submitSearch = (event) => { event.preventDefault(); visit({ q: query, page: 1 }); };
    const sort = (key) => visit({ sort: key, direction: filters.sort === key && filters.direction === 'asc' ? 'desc' : 'asc', page: 1 });
    const toggleAll = () => setSelected(allSelected ? selected.filter((id) => !ids.includes(id)) : [...new Set([...selected, ...ids])]);

    return (
        <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
            <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center">
                <form onSubmit={submitSearch} className="relative min-w-0 flex-1 sm:max-w-md">
                    <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
                    <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('admin.datatable.search')} aria-label={t('admin.datatable.search')} className="admin-input ps-9" />
                </form>
                <div className="flex gap-2">
                    {selected.length ? <button type="button" onClick={() => setConfirmOpen(true)} className="admin-button-danger"><Trash2 className="size-4" />{t('admin.datatable.deleteSelected', { count: selected.length })}</button> : null}
                    {createHref ? <Link href={createHref} className="admin-button-primary"><Plus className="size-4" />{t('admin.datatable.create')}</Link> : null}
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-bg">
                        <tr>
                            <th className="w-12 px-4 py-3"><input type="checkbox" checked={allSelected} onChange={toggleAll} aria-label={t('admin.datatable.selectAll')} /></th>
                            {columns.map((column) => (
                                <th key={column.key} className="whitespace-nowrap px-4 py-3 text-start text-xs font-semibold uppercase tracking-wide text-muted">
                                    {column.sortable ? (
                                        <button type="button" onClick={() => sort(column.key)} className="inline-flex items-center gap-1 hover:text-text">
                                            {column.label}
                                            {filters.sort === column.key ? (filters.direction === 'asc' ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />) : null}
                                        </button>
                                    ) : column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {rows.map((row) => {
                            const id = getRowId(row);
                            return (
                                <tr key={id} className="hover:bg-bg/70">
                                    <td className="px-4 py-3"><input type="checkbox" checked={selected.includes(id)} onChange={() => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])} aria-label={t('admin.datatable.selectRow')} /></td>
                                    {columns.map((column) => <td key={column.key} className="whitespace-nowrap px-4 py-3 text-sm text-text">{column.render ? column.render(row) : row[column.key] ?? '—'}</td>)}
                                </tr>
                            );
                        })}
                        {!rows.length ? <tr><td colSpan={columns.length + 1} className="px-4 py-12 text-center text-sm text-muted">{t('admin.datatable.empty')}</td></tr> : null}
                    </tbody>
                </table>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-border px-4 py-3 text-sm text-muted">
                <span>{t('common.paginationStatus', { from: pagination.from ?? 0, to: pagination.to ?? 0, total: pagination.total ?? 0 })}</span>
                <div className="flex gap-2">
                    <Link href={pagination.prev ?? '#'} aria-disabled={!pagination.prev} className={`admin-icon-button ${!pagination.prev ? 'pointer-events-none opacity-40' : ''}`}><ChevronLeft className="size-4" /><span className="sr-only">{t('common.previous')}</span></Link>
                    <Link href={pagination.next ?? '#'} aria-disabled={!pagination.next} className={`admin-icon-button ${!pagination.next ? 'pointer-events-none opacity-40' : ''}`}><ChevronRight className="size-4" /><span className="sr-only">{t('common.next')}</span></Link>
                </div>
            </div>
            <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={() => { setConfirmOpen(false); onBulkDelete(selected); }} />
        </div>
    );
}
