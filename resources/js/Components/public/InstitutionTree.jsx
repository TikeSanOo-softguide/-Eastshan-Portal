import { localizedHref } from '@/lib/navigation';
import { Link, usePage } from '@inertiajs/react';

function TreeNodes({ nodes, depth = 0 }) {
    const locale = usePage().props.locale ?? 'my';

    if (!nodes?.length) {
        return null;
    }

    return (
        <ul className={depth === 0 ? 'space-y-2' : 'ms-5 mt-2 space-y-2 border-s border-border ps-4'}>
            {nodes.map((node) => (
                <li key={node.id}>
                    <Link
                        href={localizedHref(locale, `/institutions/${node.slug}`)}
                        className="inline-flex min-h-11 items-center text-sm text-text hover:border-b hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                        {node.name}
                    </Link>
                    <TreeNodes nodes={node.children} depth={depth + 1} />
                </li>
            ))}
        </ul>
    );
}

export default function InstitutionTree({ nodes, emptyLabel }) {
    if (!nodes?.length) {
        return <p className="text-sm text-muted">{emptyLabel}</p>;
    }

    return <TreeNodes nodes={nodes} />;
}
