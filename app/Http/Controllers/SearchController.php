<?php

namespace App\Http\Controllers;

use App\Contracts\SiteSearcher;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SearchController extends Controller
{
    public function __invoke(Request $request, SiteSearcher $searcher): Response
    {
        $q = $request->string('q')->toString();
        $paginator = $searcher->search($q, 12);

        return Inertia::render('Public/Search/Index', [
            'filters' => ['q' => $q],
            'results' => [
                'data' => $paginator->items(),
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
            ],
        ]);
    }
}
