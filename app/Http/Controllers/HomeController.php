<?php

namespace App\Http\Controllers;

use App\Enums\InfrastructureCategory;
use App\Http\Resources\NewsItemResource;
use App\Models\InfrastructureItem;
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
            ->limit(5)
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
        ];
    }
}
