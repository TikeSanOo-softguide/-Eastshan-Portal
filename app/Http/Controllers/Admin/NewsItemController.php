<?php

namespace App\Http\Controllers\Admin;

use App\Enums\CategoryType;
use App\Http\Controllers\Admin\Concerns\AppliesAdminListQuery;
use App\Http\Controllers\Admin\Concerns\FormatsAdminPaginator;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\NewsItemRequest;
use App\Models\Category;
use App\Models\NewsItem;
use App\Support\TranslatableInput;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NewsItemController extends Controller
{
    use AppliesAdminListQuery;
    use FormatsAdminPaginator;

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', NewsItem::class);

        $query = NewsItem::query()->with('category:id,name,slug');
        $this->applyListQuery($query, $request, ['title->trans', 'source_name'], [
            'title' => 'title', 'published_at' => 'published_at', 'updated_at' => 'updated_at',
        ], 'published_at', 'desc');

        return Inertia::render('Admin/News/Index', [
            'filters' => [
                'q' => $request->string('q')->toString(),
                'sort' => $request->string('sort')->toString() ?: 'published_at',
                'direction' => $request->string('direction')->toString() ?: 'desc',
            ],
            'news' => $this->formatPaginator(
                $query->paginate(15)->withQueryString(),
                fn (NewsItem $item) => [
                    'id' => $item->id,
                    'title' => $item->title,
                    'source_name' => $item->source_name,
                    'category' => $item->category?->name,
                    'is_published' => $item->published_at !== null && $item->published_at <= now(),
                    'published_at' => $item->published_at?->toIso8601String(),
                    'updated_at' => $item->updated_at?->toIso8601String(),
                ],
            ),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', NewsItem::class);

        return Inertia::render('Admin/News/Form', [
            'item' => null,
            'options' => $this->options(),
        ]);
    }

    public function store(NewsItemRequest $request): RedirectResponse
    {
        $item = NewsItem::query()->create($this->payload($request));

        return redirect()->route('admin.news.edit', $item)->with('success', 'admin.flash.created');
    }

    public function edit(int|string $news_item): Response
    {
        $newsItem = NewsItem::query()->findOrFail($news_item);
        $this->authorize('update', $newsItem);

        return Inertia::render('Admin/News/Form', [
            'item' => [
                'id' => $newsItem->id,
                'category_id' => $newsItem->category_id,
                'title' => $newsItem->getTranslations('title'),
                'excerpt' => $newsItem->getTranslations('excerpt'),
                'source_name' => $newsItem->source_name,
                'source_url' => $newsItem->source_url,
                'is_published' => $newsItem->published_at !== null,
                'published_at' => $newsItem->published_at?->format('Y-m-d\TH:i'),
            ],
            'options' => $this->options(),
        ]);
    }

    public function update(NewsItemRequest $request, int|string $news_item): RedirectResponse
    {
        $newsItem = NewsItem::query()->findOrFail($news_item);
        $newsItem->update($this->payload($request, $newsItem));

        return redirect()->route('admin.news.edit', $newsItem)->with('success', 'admin.flash.updated');
    }

    public function destroy(int|string $news_item): RedirectResponse
    {
        $newsItem = NewsItem::query()->findOrFail($news_item);
        $this->authorize('delete', $newsItem);
        $newsItem->delete();

        return redirect()->route('admin.news.index')->with('success', 'admin.flash.deleted');
    }

    public function bulkDestroy(Request $request): RedirectResponse
    {
        $this->authorize('deleteAny', NewsItem::class);
        $ids = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:news_items,id'],
        ])['ids'];
        NewsItem::query()->whereIn('id', $ids)->delete();

        return redirect()->route('admin.news.index')->with('success', 'admin.flash.bulkDeleted');
    }

    private function payload(NewsItemRequest $request, ?NewsItem $existing = null): array
    {
        $validated = $request->validated();
        $published = $request->boolean('is_published');

        return [
            'category_id' => $validated['category_id'],
            'title' => TranslatableInput::from($validated['title']),
            'excerpt' => TranslatableInput::from($validated['excerpt']),
            'source_name' => $validated['source_name'],
            'source_url' => $validated['source_url'],
            'published_at' => $published
                ? ($validated['published_at'] ?? $existing?->published_at ?? now())
                : null,
        ];
    }

    private function options(): array
    {
        return [
            'categories' => Category::query()
                ->where('type', CategoryType::News)
                ->ordered()
                ->get(['id', 'name'])
                ->map(fn (Category $item) => ['id' => $item->id, 'name' => $item->name])
                ->values(),
        ];
    }
}
