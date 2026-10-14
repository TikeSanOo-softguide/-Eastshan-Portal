<?php

namespace App\Http\Controllers\Admin;

use App\Enums\InfrastructureCategory;
use App\Enums\InfrastructureStatus;
use App\Http\Controllers\Admin\Concerns\AppliesAdminListQuery;
use App\Http\Controllers\Admin\Concerns\FormatsAdminPaginator;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\InfrastructureItemRequest;
use App\Models\InfrastructureItem;
use App\Models\Township;
use App\Support\TranslatableInput;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InfrastructureItemController extends Controller
{
    use AppliesAdminListQuery;
    use FormatsAdminPaginator;

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', InfrastructureItem::class);

        $query = InfrastructureItem::query()->with('township:id,name');
        $this->applyListQuery($query, $request, ['name->trans'], [
            'name' => 'name', 'year' => 'year', 'updated_at' => 'updated_at', 'sort_order' => 'sort_order',
        ], 'sort_order', 'asc');

        return Inertia::render('Admin/Infrastructure/Index', [
            'filters' => [
                'q' => $request->string('q')->toString(),
                'sort' => $request->string('sort')->toString() ?: 'sort_order',
                'direction' => $request->string('direction')->toString() ?: 'asc',
            ],
            'items' => $this->formatPaginator(
                $query->paginate(15)->withQueryString(),
                fn (InfrastructureItem $item) => [
                    'id' => $item->id,
                    'name' => $item->name,
                    'category' => $item->category->value,
                    'status' => $item->status->value,
                    'township' => $item->township?->name,
                    'year' => $item->year,
                    'updated_at' => $item->updated_at?->toIso8601String(),
                ],
            ),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', InfrastructureItem::class);

        return Inertia::render('Admin/Infrastructure/Form', [
            'item' => null,
            'options' => $this->options(),
        ]);
    }

    public function store(InfrastructureItemRequest $request): RedirectResponse
    {
        $item = InfrastructureItem::query()->create($this->payload($request));

        return redirect()->route('admin.infrastructure.edit', $item)->with('success', 'admin.flash.created');
    }

    public function edit(int|string $infrastructure_item): Response
    {
        $item = InfrastructureItem::query()->findOrFail($infrastructure_item);
        $this->authorize('update', $item);

        return Inertia::render('Admin/Infrastructure/Form', [
            'item' => [
                'id' => $item->id,
                'township_id' => $item->township_id,
                'category' => $item->category->value,
                'name' => $item->getTranslations('name'),
                'status' => $item->status->value,
                'stats' => $item->stats ?? [],
                'year' => $item->year,
                'sort_order' => $item->sort_order,
            ],
            'options' => $this->options(),
        ]);
    }

    public function update(InfrastructureItemRequest $request, int|string $infrastructure_item): RedirectResponse
    {
        $item = InfrastructureItem::query()->findOrFail($infrastructure_item);
        $item->update($this->payload($request));

        return redirect()->route('admin.infrastructure.edit', $item)->with('success', 'admin.flash.updated');
    }

    public function destroy(int|string $infrastructure_item): RedirectResponse
    {
        $item = InfrastructureItem::query()->findOrFail($infrastructure_item);
        $this->authorize('delete', $item);
        $item->delete();

        return redirect()->route('admin.infrastructure.index')->with('success', 'admin.flash.deleted');
    }

    public function bulkDestroy(Request $request): RedirectResponse
    {
        $this->authorize('deleteAny', InfrastructureItem::class);
        $ids = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:infrastructure_items,id'],
        ])['ids'];
        InfrastructureItem::query()->whereIn('id', $ids)->delete();

        return redirect()->route('admin.infrastructure.index')->with('success', 'admin.flash.bulkDeleted');
    }

    private function payload(InfrastructureItemRequest $request): array
    {
        $validated = $request->validated();

        return [
            'township_id' => $validated['township_id'],
            'category' => $validated['category'],
            'name' => TranslatableInput::from($validated['name']),
            'status' => $validated['status'],
            'stats' => $validated['stats'] ?? [],
            'year' => $validated['year'] ?? null,
            'sort_order' => (int) ($validated['sort_order'] ?? 0),
        ];
    }

    private function options(): array
    {
        return [
            'townships' => Township::query()->ordered()->get(['id', 'name'])
                ->map(fn (Township $item) => ['id' => $item->id, 'name' => $item->name])->values(),
            'categories' => collect(InfrastructureCategory::cases())->map(fn ($c) => [
                'value' => $c->value, 'label' => $c->value,
            ])->values(),
            'statuses' => collect(InfrastructureStatus::cases())->map(fn ($c) => [
                'value' => $c->value, 'label' => $c->value,
            ])->values(),
        ];
    }
}
