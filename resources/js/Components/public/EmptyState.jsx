export default function EmptyState({ title, description }) {
    return (
        <div
            data-testid="empty-state"
            className="border border-dashed border-border px-6 py-16 text-center"
        >
            <p className="font-display text-xl text-text">{title}</p>
            {description ? (
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
                    {description}
                </p>
            ) : null}
        </div>
    );
}
