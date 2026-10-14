<?php

namespace App\Http\Controllers;

use App\Enums\CategoryType;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\NewsItemResource;
use App\Http\Resources\PaginatedResource;
use App\Models\Category;
use App\Models\NewsItem;
use App\Support\PublicCache;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NewsController extends Controller
{
    public function index(Request $request): Response
    {
        $categorySlug = $request->string('category')->toString();
        $from = $request->string('from')->toString();
        $to = $request->string('to')->toString();

        $page = max(1, (int) $request->integer('page', 1));

        return Inertia::render('Public/News/Index', PublicCache::remember(
            'news.'.md5($categorySlug.'|'.$from.'|'.$to.'|'.$page),
            function () use ($request, $categorySlug, $from, $to) {
                $query = NewsItem::query()
                    ->published()
                    ->with(['category:id,type,name,slug'])
                    ->ordered();

                if ($categorySlug !== '') {
                    $query->whereHas('category', fn ($builder) => $builder
                        ->where('type', CategoryType::News)
                        ->where('slug', $categorySlug));
                }

                if ($from !== '') {
                    $query->whereDate('published_at', '>=', $from);
                }

                if ($to !== '') {
                    $query->whereDate('published_at', '<=', $to);
                }

                $paginator = $query->paginate(12)->withQueryString();

                return [
                    'filters' => [
                        'category' => $categorySlug,
                        'from' => $from,
                        'to' => $to,
                    ],
                    'categories' => CategoryResource::collection(
                        Category::query()
                            ->where('type', CategoryType::News)
                            ->ordered()
                            ->get()
                    )->resolve(),
                    'news' => PaginatedResource::make($paginator, NewsItemResource::class),
                ];
            }
        ));
    }
}
