<?php

namespace App\Http\Controllers;

use App\Enums\InfrastructureCategory;
use App\Enums\InfrastructureStatus;
use App\Http\Resources\InfrastructureItemResource;
use App\Http\Resources\PaginatedResource;
use App\Http\Resources\TownshipResource;
use App\Models\InfrastructureItem;
use App\Models\Township;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class InfrastructureController extends Controller
{
    public function __invoke(Request $request, string $locale, ?string $category = null): Response
    {
        $categoryKey = $category ?? $request->string('category')->toString();
        $resolved = $this->resolveCategory($categoryKey) ?? InfrastructureCategory::Education;

        if ($categoryKey !== '' && ! $this->resolveCategory($categoryKey)) {
            throw new NotFoundHttpException;
        }

        $townshipSlug = $request->string('township')->toString();

        $query = InfrastructureItem::query()
            ->with(['township:id,name,slug'])
            ->where('category', $resolved)
            ->ordered();

        if ($townshipSlug !== '') {
            $query->whereHas('township', fn ($builder) => $builder->where('slug', $townshipSlug));
        }

        $paginator = $query->paginate(12)->withQueryString();

        $scope = InfrastructureItem::query()->where('category', $resolved);

        if ($townshipSlug !== '') {
            $scope->whereHas('township', fn ($builder) => $builder->where('slug', $townshipSlug));
        }

        $statusCounts = [
            'operational' => (clone $scope)->where('status', InfrastructureStatus::Operational)->count(),
            'under_construction' => (clone $scope)->where('status', InfrastructureStatus::UnderConstruction)->count(),
            'planned' => (clone $scope)->where('status', InfrastructureStatus::Planned)->count(),
            'total' => (clone $scope)->count(),
        ];

        return Inertia::render('Public/Infrastructure/Index', [
            'category' => $resolved->value,
            'filters' => [
                'township' => $townshipSlug,
            ],
            'categories' => collect(InfrastructureCategory::cases())
                ->map(fn (InfrastructureCategory $case) => [
                    'value' => $case->value,
                    'label_key' => 'infrastructure.categories.'.$case->value,
                    'href' => $this->categoryHref($case),
                ])
                ->values(),
            'townships' => TownshipResource::collection(
                Township::query()->ordered()->get(['id', 'name', 'slug', 'population'])
            )->resolve(),
            'summary' => $statusCounts,
            'items' => PaginatedResource::make($paginator, InfrastructureItemResource::class),
        ]);
    }

    private function resolveCategory(?string $category): ?InfrastructureCategory
    {
        return match ($category) {
            null, '' => null,
            'education' => InfrastructureCategory::Education,
            'health' => InfrastructureCategory::Health,
            'electricity' => InfrastructureCategory::Electricity,
            'roads-bridges', 'road_bridge', 'roads_bridges' => InfrastructureCategory::RoadBridge,
            default => InfrastructureCategory::tryFrom($category),
        };
    }

    private function categoryHref(InfrastructureCategory $category): string
    {
        return match ($category) {
            InfrastructureCategory::Education => '/infrastructure/education',
            InfrastructureCategory::Health => '/infrastructure/health',
            InfrastructureCategory::Electricity => '/infrastructure/electricity',
            InfrastructureCategory::RoadBridge => '/infrastructure/roads-bridges',
        };
    }
}
