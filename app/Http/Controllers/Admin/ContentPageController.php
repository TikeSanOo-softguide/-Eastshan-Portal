<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ContentSection;
use App\Http\Controllers\Admin\Concerns\AppliesAdminListQuery;
use App\Http\Controllers\Admin\Concerns\FormatsAdminPaginator;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ContentPageRequest;
use App\Models\ContentPage;
use App\Support\StoresUploadedMedia;
use App\Support\TranslatableInput;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContentPageController extends Controller
{
    use AppliesAdminListQuery;
    use FormatsAdminPaginator;
    use StoresUploadedMedia;

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', ContentPage::class);

        $query = ContentPage::query();
        $this->applyListQuery($query, $request, ['title->trans', 'slug'], [
            'title' => 'title', 'slug' => 'slug', 'updated_at' => 'updated_at', 'sort_order' => 'sort_order',
        ], 'sort_order', 'asc');

        return Inertia::render('Admin/ContentPages/Index', [
            'filters' => [
                'q' => $request->string('q')->toString(),
                'sort' => $request->string('sort')->toString() ?: 'sort_order',
                'direction' => $request->string('direction')->toString() ?: 'asc',
            ],
            'pages' => $this->formatPaginator(
                $query->paginate(15)->withQueryString(),
                fn (ContentPage $item) => [
                    'id' => $item->id,
                    'title' => $item->title,
                    'slug' => $item->slug,
                    'section' => $item->section->value,
                    'is_published' => $item->is_published,
                    'updated_at' => $item->updated_at?->toIso8601String(),
                ],
            ),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', ContentPage::class);

        return Inertia::render('Admin/ContentPages/Form', [
            'page' => null,
            'options' => $this->options(),
        ]);
    }

    public function store(ContentPageRequest $request): RedirectResponse
    {
        $page = ContentPage::query()->create($this->payload($request));

        return redirect()->route('admin.content-pages.edit', $page)->with('success', 'admin.flash.created');
    }

    public function edit(ContentPage $contentPage): Response
    {
        $this->authorize('update', $contentPage);

        return Inertia::render('Admin/ContentPages/Form', [
            'page' => [
                'id' => $contentPage->id,
                'section' => $contentPage->section->value,
                'slug' => $contentPage->slug,
                'title' => $contentPage->getTranslations('title'),
                'body' => $contentPage->getTranslations('body'),
                'cover' => $this->publicMediaUrl($contentPage->cover),
                'is_published' => $contentPage->is_published,
                'sort_order' => $contentPage->sort_order,
            ],
            'options' => $this->options(),
        ]);
    }

    public function update(ContentPageRequest $request, ContentPage $contentPage): RedirectResponse
    {
        $contentPage->update($this->payload($request, $contentPage));

        return redirect()->route('admin.content-pages.edit', $contentPage)->with('success', 'admin.flash.updated');
    }

    public function destroy(ContentPage $contentPage): RedirectResponse
    {
        $this->authorize('delete', $contentPage);
        $contentPage->delete();

        return redirect()->route('admin.content-pages.index')->with('success', 'admin.flash.deleted');
    }

    public function bulkDestroy(Request $request): RedirectResponse
    {
        $this->authorize('deleteAny', ContentPage::class);
        $ids = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:content_pages,id'],
        ])['ids'];
        ContentPage::query()->whereIn('id', $ids)->delete();

        return redirect()->route('admin.content-pages.index')->with('success', 'admin.flash.bulkDeleted');
    }

    private function payload(ContentPageRequest $request, ?ContentPage $existing = null): array
    {
        $validated = $request->validated();

        return [
            'section' => $validated['section'],
            'slug' => $validated['slug'],
            'title' => TranslatableInput::from($validated['title']),
            'body' => TranslatableInput::from($validated['body'] ?? []),
            'cover' => $this->storePublicUpload($request->file('cover'), 'pages', $existing?->cover),
            'is_published' => $request->boolean('is_published'),
            'sort_order' => (int) ($validated['sort_order'] ?? 0),
        ];
    }

    private function options(): array
    {
        return [
            'sections' => collect(ContentSection::cases())->map(fn ($case) => [
                'value' => $case->value,
                'label' => $case->value,
            ])->values(),
        ];
    }
}
