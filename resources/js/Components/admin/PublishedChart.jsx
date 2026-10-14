import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useTranslation } from 'react-i18next';

export default function PublishedChart({ data = [] }) {
    const { t } = useTranslation();
    return (
        <div className="h-80 rounded-xl border border-border bg-surface p-5 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-text">{t('admin.stats.publishedChart')}</h2>
            <ResponsiveContainer width="100%" height="85%">
                <LineChart data={data} margin={{ left: -20, right: 12 }}>
                    <CartesianGrid stroke="rgb(var(--border))" strokeDasharray="3 3" />
                    <XAxis dataKey="label" tick={{ fill: 'rgb(var(--muted))', fontSize: 12 }} tickLine={false} axisLine={false} />
                    <YAxis allowDecimals={false} tick={{ fill: 'rgb(var(--muted))', fontSize: 12 }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: 'rgb(var(--surface))', borderColor: 'rgb(var(--border))', color: 'rgb(var(--text))' }} />
                    <Line type="monotone" dataKey="total" stroke="#52648e" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
