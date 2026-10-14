<?php

namespace App\Http\Controllers;

use App\Http\Resources\InstitutionSummaryResource;
use App\Http\Resources\LeaderResource;
use App\Models\Institution;
use Inertia\Inertia;
use Inertia\Response;

class LeadershipController extends Controller
{
    public function __invoke(): Response
    {
        $institutions = Institution::query()
            ->active()
            ->whereNull('parent_id')
            ->ordered()
            ->with([
                'leaders' => fn ($query) => $query->ordered(),
                'children' => fn ($query) => $query->active()->ordered()->with([
                    'leaders' => fn ($leaders) => $leaders->ordered(),
                ]),
            ])
            ->get();

        $groups = $institutions->map(function (Institution $institution) {
            $childGroups = $institution->children->map(fn (Institution $child) => [
                'institution' => (new InstitutionSummaryResource($child))->resolve(),
                'leaders' => LeaderResource::collection($child->leaders)->resolve(),
            ])->values();

            return [
                'institution' => (new InstitutionSummaryResource($institution))->resolve(),
                'leaders' => LeaderResource::collection($institution->leaders)->resolve(),
                'children' => $childGroups,
            ];
        })->values();

        return Inertia::render('Public/Leadership/Index', [
            'groups' => $groups,
        ]);
    }
}
