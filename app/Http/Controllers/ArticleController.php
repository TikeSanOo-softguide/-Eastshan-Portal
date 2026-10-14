<?php

namespace App\Http\Controllers;

use App\Enums\ArticleCategory;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\ArticleSummaryResource;
use App\Http\Resources\PaginatedResource;
use App\Models\Article;
use App\Support\PublicCache;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ArticleController extends Controller
{
    public function index(Request $request, string $locale, ?string $category = null): Response
    {
        $resolved = $this->resolveCategory($category) ?? ArticleCategory::Knowledge;

        if ($category !== null && $category !== '' && ! $this->resolveCategory($category)) {
            throw new NotFoundHttpException;
        }

        $page = max(1, (int) $request->integer('page', 1));

        return Inertia::render('Public/Articles/Index', PublicCache::remember(
            'articles.'.$resolved->value.'.'.$page,
            function () use ($resolved) {
                $paginator = Article::query()
                    ->published()
                    ->with(['author:id,name'])
                    ->where('category', $resolved)
                    ->ordered()
                    ->paginate(12)
                    ->withQueryString();

                return [
                    'category' => $resolved->value,
                    'categories' => collect(ArticleCategory::cases())
                        ->map(fn (ArticleCategory $case) => [
                            'value' => $case->value,
                            'label_key' => 'articles.categories.'.$case->value,
                            'href' => '/articles/'.$case->value,
                        ])
                        ->values(),
                    'articles' => PaginatedResource::make($paginator, ArticleSummaryResource::class),
                ];
            }
        ));
    }

    public function show(string $locale, string $category, string $slug): Response
    {
        $resolved = $this->resolveCategory($category);

        if (! $resolved) {
            throw new NotFoundHttpException;
        }

        $article = Article::query()
            ->published()
            ->with(['author:id,name'])
            ->where('category', $resolved)
            ->where('slug', $slug)
            ->firstOrFail();

        $related = Article::query()
            ->published()
            ->with(['author:id,name'])
            ->where('category', $resolved)
            ->where('id', '!=', $article->id)
            ->ordered()
            ->limit(3)
            ->get();

        return Inertia::render('Public/Articles/Show', [
            'article' => (new ArticleResource($article))->resolve(),
            'related' => ArticleSummaryResource::collection($related)->resolve(),
        ]);
    }

    private function resolveCategory(?string $category): ?ArticleCategory
    {
        return match ($category) {
            null, '' => null,
            'knowledge' => ArticleCategory::Knowledge,
            'literary' => ArticleCategory::Literary,
            'news' => ArticleCategory::News,
            default => ArticleCategory::tryFrom($category),
        };
    }
}
