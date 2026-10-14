import Skeleton from '@/Components/ui/Skeleton';

export default function ListSkeleton({ count = 6, variant = 'cards' }) {
    if (variant === 'table') {
        return (
            <div data-testid="list-skeleton" className="space-y-3" aria-hidden="true">
                {Array.from({ length: count }).map((_, index) => (
                    <Skeleton key={index} className="h-12 w-full" />
                ))}
            </div>
        );
    }

    return (
        <ul
            data-testid="list-skeleton"
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            aria-hidden="true"
        >
            {Array.from({ length: count }).map((_, index) => (
                <li key={index}>
                    <Skeleton className="aspect-[4/3] w-full" />
                    <Skeleton className="mt-4 h-5 w-2/3" />
                    <Skeleton className="mt-2 h-4 w-full" />
                </li>
            ))}
        </ul>
    );
}
