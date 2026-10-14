<?php

namespace App\Http\Controllers\Admin;

use App\Enums\InstitutionType;
use App\Http\Controllers\Admin\Concerns\AppliesAdminListQuery;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\InstitutionRequest;
use App\Models\Institution;
use App\Support\StoresUploadedMedia;
use App\Support\TranslatableInput;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InstitutionController extends Controller
{
    use AppliesAdminListQuery;
    use StoresUploadedMedia;

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Institution::class);

        $query = Institution::query()->with('parent:id,name,slug');
        $this->applyListQuery(
            $query,
            $request,
            ['name->trans', 'slug', 'email'],
            ['name' => 'name', 'slug' => 'slug', 'updated_at' => 'updated_at', 'sort_order' => 'sort_order'],
            'sort_order',
            'asc',
        );

        $paginator = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Institutions/Index', [
            'filters' => [
                'q' => $request->string('q')->toString(),
                'sort' => $request->string('sort')->toString() ?: 'sort_order',
                'direction' => $request->string('direction')->toString() ?: 'asc',
            ],
            'institutions' => [
                'data' => $paginator->getCollection()->map(fn (Institution $item) => $this->summary($item))->values(),
                'meta' => [
                    'current_page' => $paginator->currentPage(),
                    'last_page' => $paginator->lastPage(),
                    'per_page' => $paginator->perPage(),
                    'total' => $paginator->total(),
                    'from' => $paginator->firstItem(),
                    'to' => $paginator->lastItem(),
                ],
                'links' => [
                    'first' => $paginator->url(1),
                    'last' => $paginator->url(max($paginator->lastPage(), 1)),
                    'prev' => $paginator->previousPageUrl(),
                    'next' => $paginator->nextPageUrl(),
                ],
            ],
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Institution::class);

        return Inertia::render('Admin/Institutions/Form', [
            'institution' => null,
            'options' => $this->options(),
        ]);
    }

    public function store(InstitutionRequest $request): RedirectResponse
    {
        $data = $this->payload($request);
        $institution = Institution::query()->create($data);

        return redirect()
            ->route('admin.institutions.edit', $institution)
            ->with('success', 'admin.flash.created');
    }

    public function edit(Institution $institution): Response
    {
        $this->authorize('update', $institution);

        return Inertia::render('Admin/Institutions/Form', [
            'institution' => $this->detail($institution),
            'options' => $this->options($institution->id),
        ]);
    }

    public function update(InstitutionRequest $request, Institution $institution): RedirectResponse
    {
        $institution->update($this->payload($request, $institution));

        return redirect()
            ->route('admin.institutions.edit', $institution)
            ->with('success', 'admin.flash.updated');
    }

    public function destroy(Institution $institution): RedirectResponse
    {
        $this->authorize('delete', $institution);
        $institution->delete();

        return redirect()
            ->route('admin.institutions.index')
            ->with('success', 'admin.flash.deleted');
    }

    public function bulkDestroy(Request $request): RedirectResponse
    {
        $this->authorize('deleteAny', Institution::class);

        $ids = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:institutions,id'],
        ])['ids'];

        Institution::query()->whereIn('id', $ids)->delete();

        return redirect()
            ->route('admin.institutions.index')
            ->with('success', 'admin.flash.bulkDeleted');
    }

    /**
     * @return array<string, mixed>
     */
    private function payload(InstitutionRequest $request, ?Institution $existing = null): array
    {
        $validated = $request->validated();

        return [
            'parent_id' => $validated['parent_id'] ?? null,
            'type' => $validated['type'],
            'name' => TranslatableInput::from($validated['name']),
            'description' => TranslatableInput::from($validated['description'] ?? []),
            'slug' => $validated['slug'],
            'address' => $validated['address'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'email' => $validated['email'] ?? null,
            'logo' => $this->storePublicUpload(
                $request->file('logo'),
                'institutions',
                $existing?->logo,
            ),
            'sort_order' => (int) ($validated['sort_order'] ?? 0),
            'is_active' => $request->boolean('is_active', true),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function summary(Institution $item): array
    {
        return [
            'id' => $item->id,
            'name' => $item->name,
            'slug' => $item->slug,
            'type' => $item->type->value,
            'is_active' => $item->is_active,
            'parent' => $item->parent?->name,
            'updated_at' => $item->updated_at?->toIso8601String(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function detail(Institution $item): array
    {
        return [
            'id' => $item->id,
            'parent_id' => $item->parent_id,
            'type' => $item->type->value,
            'name' => $item->getTranslations('name'),
            'description' => $item->getTranslations('description'),
            'slug' => $item->slug,
            'address' => $item->address,
            'phone' => $item->phone,
            'email' => $item->email,
            'logo' => $this->publicMediaUrl($item->logo),
            'sort_order' => $item->sort_order,
            'is_active' => $item->is_active,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function options(?int $exceptId = null): array
    {
        return [
            'types' => collect(InstitutionType::cases())->map(fn ($case) => [
                'value' => $case->value,
                'label' => $case->value,
            ])->values(),
            'parents' => Institution::query()
                ->when($exceptId, fn ($q) => $q->where('id', '!=', $exceptId))
                ->ordered()
                ->get(['id', 'name'])
                ->map(fn (Institution $item) => [
                    'id' => $item->id,
                    'name' => $item->name,
                ])
                ->values(),
        ];
    }
}
