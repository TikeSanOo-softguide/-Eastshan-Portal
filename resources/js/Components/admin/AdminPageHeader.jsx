export default function AdminPageHeader({ title, description, actions }) {
    return (
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-text">{title}</h1>
                {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
            </div>
            {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
        </div>
    );
}
