<?php

namespace App\Contracts;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * Site-wide search. Default implementation uses SQL LIKE.
 * Swap the binding to a Scout-backed class when Scout is enabled.
 */
interface SiteSearcher
{
    /**
     * @return LengthAwarePaginator<int, array{type: string, id: int, title: string, excerpt: string, href: string, published_at: ?string}>
     */
    public function search(string $query, int $perPage = 12): LengthAwarePaginator;
}
