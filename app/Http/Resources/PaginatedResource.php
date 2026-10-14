<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Pagination\LengthAwarePaginator;

class PaginatedResource
{
    /**
     * @param  class-string  $resource
     * @return array{data: mixed, meta: array<string, mixed>, links: array<string, mixed>}
     */
    public static function make(LengthAwarePaginator $paginator, string $resource): array
    {
        /** @var AnonymousResourceCollection $collection */
        $collection = $resource::collection($paginator->getCollection());

        return [
            'data' => $collection->resolve(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'from' => $paginator->firstItem(),
                'to' => $paginator->lastItem(),
            ],
            'links' => [
                'first' => $paginator->url(1),
                'last' => $paginator->url(max($paginator->lastPage(), 1)),
                'prev' => $paginator->previousPageUrl(),
                'next' => $paginator->nextPageUrl(),
            ],
        ];
    }
}
