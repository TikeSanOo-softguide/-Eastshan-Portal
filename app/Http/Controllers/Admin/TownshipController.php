<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\AppliesAdminListQuery;
use App\Http\Controllers\Admin\Concerns\FormatsAdminPaginator;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\TownshipRequest;
use App\Models\Township;
use App\Support\TranslatableInput;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TownshipController extends Controller
{
    use AppliesAdminListQuery;
    use FormatsAdminPaginator;

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Township::class);

        $query = Township::query();
        $this->applyListQuery($query, $request, ['name->trans', 'slug'], [
            'name' => 'name', 'slug' => 'slug', 'population' => 'population', 'updated_at' => 'updated_at',
        ], 'sort_order', 'asc');

        return Inertia::render('Admin/Townships/Index', [
            'filters' => [
                'q' => $request->string('q')->toString(),
                'sort' => $request->string('sort')->toString() ?: 'sort_order',
                'direction' => $request->string('direction')->toString() ?: 'asc',
            ],
            'townships' => $this->formatPaginator(
                $query->paginate(15)->withQueryString(),
                fn (Township $item) => [
                    'id' => $item->id,
                    'name' => $item->name,
                    'slug' => $item->slug,
                    'population' => $item->population,
                    'updated_at' => $item->updated_at?->toIso8601String(),
                ],
            ),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Township::class);

        return Inertia::render('Admin/Townships/Form', ['township' => null]);
    }

    public function store(TownshipRequest $request): RedirectResponse
    {
        $township = Township::query()->create($this->payload($request));

        return redirect()->route('admin.townships.edit', $township)->with('success', 'admin.flash.created');
    }

    public function edit(Township $township): Response
    {
        $this->authorize('update', $township);

        return Inertia::render('Admin/Townships/Form', [
            'township' => [
                'id' => $township->id,
                'name' => $township->getTranslations('name'),
                'slug' => $township->slug,
                'population' => $township->population,
                'area_km2' => $township->area_km2,
                'lat' => $township->lat,
                'lng' => $township->lng,
                'sort_order' => $township->sort_order,
            ],
        ]);
    }

    public function update(TownshipRequest $request, Township $township): RedirectResponse
    {
        $township->update($this->payload($request));

        return redirect()->route('admin.townships.edit', $township)->with('success', 'admin.flash.updated');
    }

    public function destroy(Township $township): RedirectResponse
    {
        $this->authorize('delete', $township);
        $township->delete();

        return redirect()->route('admin.townships.index')->with('success', 'admin.flash.deleted');
    }

    public function bulkDestroy(Request $request): RedirectResponse
    {
        $this->authorize('deleteAny', Township::class);
        $ids = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:townships,id'],
        ])['ids'];
        Township::query()->whereIn('id', $ids)->delete();

        return redirect()->route('admin.townships.index')->with('success', 'admin.flash.bulkDeleted');
    }

    private function payload(TownshipRequest $request): array
    {
        $validated = $request->validated();

        return [
            'name' => TranslatableInput::from($validated['name']),
            'slug' => $validated['slug'],
            'population' => $validated['population'] ?? null,
            'area_km2' => $validated['area_km2'] ?? null,
            'lat' => $validated['lat'] ?? null,
            'lng' => $validated['lng'] ?? null,
            'sort_order' => (int) ($validated['sort_order'] ?? 0),
        ];
    }
}
