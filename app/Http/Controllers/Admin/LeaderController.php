<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\AppliesAdminListQuery;
use App\Http\Controllers\Admin\Concerns\FormatsAdminPaginator;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\LeaderRequest;
use App\Models\Institution;
use App\Models\Leader;
use App\Support\StoresUploadedMedia;
use App\Support\TranslatableInput;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeaderController extends Controller
{
    use AppliesAdminListQuery;
    use FormatsAdminPaginator;
    use StoresUploadedMedia;

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Leader::class);

        $query = Leader::query()->with('institution:id,name');
        $this->applyListQuery($query, $request, ['name->trans', 'position->trans'], [
            'name' => 'name', 'updated_at' => 'updated_at', 'sort_order' => 'sort_order',
        ], 'sort_order', 'asc');

        return Inertia::render('Admin/Leaders/Index', [
            'filters' => [
                'q' => $request->string('q')->toString(),
                'sort' => $request->string('sort')->toString() ?: 'sort_order',
                'direction' => $request->string('direction')->toString() ?: 'asc',
            ],
            'leaders' => $this->formatPaginator(
                $query->paginate(15)->withQueryString(),
                fn (Leader $item) => [
                    'id' => $item->id,
                    'name' => $item->name,
                    'position' => $item->position,
                    'institution' => $item->institution?->name,
                    'updated_at' => $item->updated_at?->toIso8601String(),
                ],
            ),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Leader::class);

        return Inertia::render('Admin/Leaders/Form', [
            'leader' => null,
            'options' => $this->options(),
        ]);
    }

    public function store(LeaderRequest $request): RedirectResponse
    {
        $leader = Leader::query()->create($this->payload($request));

        return redirect()->route('admin.leaders.edit', $leader)->with('success', 'admin.flash.created');
    }

    public function edit(Leader $leader): Response
    {
        $this->authorize('update', $leader);

        return Inertia::render('Admin/Leaders/Form', [
            'leader' => [
                'id' => $leader->id,
                'institution_id' => $leader->institution_id,
                'name' => $leader->getTranslations('name'),
                'position' => $leader->getTranslations('position'),
                'bio' => $leader->getTranslations('bio'),
                'photo' => $this->publicMediaUrl($leader->photo),
                'sort_order' => $leader->sort_order,
            ],
            'options' => $this->options(),
        ]);
    }

    public function update(LeaderRequest $request, Leader $leader): RedirectResponse
    {
        $leader->update($this->payload($request, $leader));

        return redirect()->route('admin.leaders.edit', $leader)->with('success', 'admin.flash.updated');
    }

    public function destroy(Leader $leader): RedirectResponse
    {
        $this->authorize('delete', $leader);
        $leader->delete();

        return redirect()->route('admin.leaders.index')->with('success', 'admin.flash.deleted');
    }

    public function bulkDestroy(Request $request): RedirectResponse
    {
        $this->authorize('deleteAny', Leader::class);
        $ids = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:leaders,id'],
        ])['ids'];
        Leader::query()->whereIn('id', $ids)->delete();

        return redirect()->route('admin.leaders.index')->with('success', 'admin.flash.bulkDeleted');
    }

    private function payload(LeaderRequest $request, ?Leader $existing = null): array
    {
        $validated = $request->validated();

        return [
            'institution_id' => $validated['institution_id'],
            'name' => TranslatableInput::from($validated['name']),
            'position' => TranslatableInput::from($validated['position']),
            'bio' => TranslatableInput::from($validated['bio'] ?? []),
            'photo' => $this->storePublicUpload($request->file('photo'), 'leaders', $existing?->photo),
            'sort_order' => (int) ($validated['sort_order'] ?? 0),
        ];
    }

    private function options(): array
    {
        return [
            'institutions' => Institution::query()->ordered()->get(['id', 'name'])
                ->map(fn (Institution $item) => ['id' => $item->id, 'name' => $item->name])
                ->values(),
        ];
    }
}
