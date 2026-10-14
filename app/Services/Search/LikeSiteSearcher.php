<?php

namespace App\Services\Search;

use App\Contracts\SiteSearcher;
use App\Models\Article;
use App\Models\NewsItem;
use App\Support\RichText;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\LengthAwarePaginator as Paginator;
use Illuminate\Support\Collection;

/**
 * Simple LIKE search across news and articles.
 * Replace this binding with a ScoutSiteSearcher when Laravel Scout is added.
 */
class LikeSiteSearcher implements SiteSearcher
{
    public function search(string $query, int $perPage = 12): LengthAwarePaginator
    {
        $query = trim($query);
        $page = max(1, (int) request()->integer('page', 1));

        if ($query === '') {
            return new Paginator([], 0, $perPage, $page, [
                'path' => request()->url(),
                'query' => request()->query(),
            ]);
        }

        $locale = app()->getLocale();
        $like = '%'.$query.'%';

        $news = NewsItem::query()
            ->published()
            ->with('category:id,name,slug')
            ->where(function ($builder) use ($like, $locale) {
                $builder->where("title->{$locale}", 'like', $like)
                    ->orWhere('title->en', 'like', $like)
                    ->orWhere('title->my', 'like', $like)
                    ->orWhere("excerpt->{$locale}", 'like', $like)
                    ->orWhere('excerpt->en', 'like', $like)
                    ->orWhere('source_name', 'like', $like);
            })
            ->ordered()
            ->limit(50)
            ->get()
            ->map(fn (NewsItem $item) => [
                'type' => 'news',
                'id' => $item->id,
                'title' => $item->title,
                'excerpt' => $item->excerpt,
                'href' => '/news',
                'published_at' => $item->published_at?->toIso8601String(),
            ]);

        $articles = Article::query()
            ->published()
            ->where(function ($builder) use ($like, $locale) {
                $builder->where("title->{$locale}", 'like', $like)
                    ->orWhere('title->en', 'like', $like)
                    ->orWhere('title->my', 'like', $like)
                    ->orWhere("body->{$locale}", 'like', $like)
                    ->orWhere('body->en', 'like', $like)
                    ->orWhere('slug', 'like', $like);
            })
            ->ordered()
            ->limit(50)
            ->get()
            ->map(fn (Article $article) => [
                'type' => 'article',
                'id' => $article->id,
                'title' => $article->title,
                'excerpt' => RichText::toPlainExcerpt($article->body, 140),
                'href' => '/articles/'.$article->category->value.'/'.$article->slug,
                'published_at' => $article->published_at?->toIso8601String(),
            ]);

        /** @var Collection<int, array<string, mixed>> $merged */
        $merged = $news->concat($articles)
            ->sortByDesc('published_at')
            ->values();

        $total = $merged->count();
        $slice = $merged->forPage($page, $perPage)->values();

        return new Paginator($slice, $total, $perPage, $page, [
            'path' => request()->url(),
            'query' => request()->query(),
        ]);
    }
}
