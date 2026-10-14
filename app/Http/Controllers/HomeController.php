<?php

namespace App\Http\Controllers;

use App\Enums\InfrastructureCategory;
use App\Http\Resources\ArticleSummaryResource;
use App\Http\Resources\NewsItemResource;
use App\Models\Article;
use App\Models\InfrastructureItem;
use App\Models\Leader;
use App\Models\NewsItem;
use App\Models\Township;
use App\Support\PublicCache;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        $payload = PublicCache::remember('home', function () {
            return $this->payload();
        });

        return Inertia::render('Public/Home', $payload);
    }

    /**
     * @return array<string, mixed>
     */
    private function payload(): array
    {
        $news = NewsItem::query()
            ->published()
            ->with(['category:id,type,name,slug'])
            ->ordered()
            ->limit(3)
            ->get();

        $articles = Article::query()
            ->published()
            ->with(['author:id,name'])
            ->ordered()
            ->limit(3)
            ->get();

        return [
            'stats' => [
                'population' => (int) Township::query()->sum('population'),
                'townships' => Township::query()->count(),
                'schools' => InfrastructureItem::query()
                    ->where('category', InfrastructureCategory::Education)
                    ->count(),
                'clinics' => InfrastructureItem::query()
                    ->where('category', InfrastructureCategory::Health)
                    ->count(),
            ],
            'news' => NewsItemResource::collection($news)->resolve(),
            'articles' => ArticleSummaryResource::collection($articles)->resolve(),
            'leaders' => Leader::query()
                ->with(['institution:id,name,slug'])
                ->ordered()
                ->limit(12)
                ->get()
                ->map(fn (Leader $leader) => [
                    'id' => $leader->id,
                    'name' => $leader->name,
                    'position' => $leader->position,
                    'bio' => $leader->bio,
                    'photo' => $leader->photo
                        ? '/'.$leader->photo
                        : '/videos/leader-placeholder.jpg',
                    'institution' => $leader->institution?->name,
                ])
                ->values(),
        ];
    }
}
