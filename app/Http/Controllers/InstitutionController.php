<?php

namespace App\Http\Controllers;

use App\Enums\InstitutionType;
use App\Http\Resources\InstitutionResource;
use App\Http\Resources\InstitutionSummaryResource;
use App\Http\Resources\PaginatedResource;
use App\Models\Institution;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InstitutionController extends Controller
{
    public function index(Request $request): Response
    {
        $type = $request->string('type')->toString();
        $search = $request->string('q')->toString();

        $typeEnum = InstitutionType::tryFrom($type);

        $query = Institution::query()
            ->active()
            ->ordered()
            ->withCount(['leaders', 'children']);

        if ($typeEnum) {
            $query->where('type', $typeEnum);
        }

        if ($search !== '') {
            $locale = app()->getLocale();
            $query->where(function ($builder) use ($search, $locale) {
                $builder->where("name->{$locale}", 'like', '%'.$search.'%')
                    ->orWhere('name->en', 'like', '%'.$search.'%')
                    ->orWhere('name->my', 'like', '%'.$search.'%')
                    ->orWhere('slug', 'like', '%'.$search.'%')
                    ->orWhere('address', 'like', '%'.$search.'%');
            });
        }

        $paginator = $query
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Public/Institutions/Index', [
            'filters' => [
                'type' => $typeEnum?->value ?? '',
                'q' => $search,
            ],
            'types' => collect(InstitutionType::cases())
                ->map(fn (InstitutionType $case) => [
                    'value' => $case->value,
                    'label_key' => 'institutions.types.'.$case->value,
                ])
                ->values(),
            'institutions' => PaginatedResource::make($paginator, InstitutionSummaryResource::class),
        ]);
    }

    public function show(string $locale, string $slug): Response
    {
        $institution = Institution::query()
            ->active()
            ->where('slug', $slug)
            ->with([
                'parent:id,name,slug',
                'children' => fn ($query) => $query->active()->ordered()->with([
                    'children' => fn ($child) => $child->active()->ordered(),
                ]),
                'leaders' => fn ($query) => $query->ordered(),
            ])
            ->firstOrFail();

        return Inertia::render('Public/Institutions/Show', [
            'institution' => (new InstitutionResource($institution))->resolve(),
        ]);
    }
}
