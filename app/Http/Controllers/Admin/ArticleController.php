<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ArticleCategory;
use App\Enums\PublicationStatus;
use App\Http\Controllers\Admin\Concerns\AppliesAdminListQuery;
use App\Http\Controllers\Admin\Concerns\FormatsAdminPaginator;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ArticleRequest;
use App\Models\Article;
use App\Support\StoresUploadedMedia;
use App\Support\TranslatableInput;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    use AppliesAdminListQuery;
    use FormatsAdminPaginator;
    use StoresUploadedMedia;

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Article::class);

        $query = Article::query()->with('author:id,name');
        $this->applyListQuery($query, $request, ['title->trans', 'slug'], [
            'title' => 'title', 'published_at' => 'published_at', 'updated_at' => 'updated_at', 'status' => 'status',
        ], 'published_at', 'desc');

        return Inertia::render('Admin/Articles/Index', [
            'filters' => [
                'q' => $request->string('q')->toString(),
                'sort' => $request->string('sort')->toString() ?: 'published_at',
                'direction' => $request->string('direction')->toString() ?: 'desc',
            ],
            'articles' => $this->formatPaginator(
                $query->paginate(15)->withQueryString(),
                fn (Article $item) => [
                    'id' => $item->id,
                    'title' => $item->title,
                    'slug' => $item->slug,
                    'category' => $item->category->value,
                    'status' => $item->status->value,
                    'author' => $item->author?->name,
                    'published_at' => $item->published_at?->toIso8601String(),
                    'updated_at' => $item->updated_at?->toIso8601String(),
                ],
            ),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Article::class);

        return Inertia::render('Admin/Articles/Form', [
            'article' => null,
            'options' => $this->options(),
        ]);
    }

    public function store(ArticleRequest $request): RedirectResponse
    {
        $article = Article::query()->create($this->payload($request));

        return redirect()->route('admin.articles.edit', $article)->with('success', 'admin.flash.created');
    }

    public function edit(Article $article): Response
    {
        $this->authorize('update', $article);

        return Inertia::render('Admin/Articles/Form', [
            'article' => [
                'id' => $article->id,
                'category' => $article->category->value,
                'slug' => $article->slug,
                'title' => $article->getTranslations('title'),
                'body' => $article->getTranslations('body'),
                'cover' => $this->publicMediaUrl($article->cover),
                'status' => $article->status->value,
                'published_at' => $article->published_at?->format('Y-m-d\TH:i'),
                'author_id' => $article->author_id,
            ],
            'options' => $this->options(),
        ]);
    }

    public function update(ArticleRequest $request, Article $article): RedirectResponse
    {
        $article->update($this->payload($request, $article));

        return redirect()->route('admin.articles.edit', $article)->with('success', 'admin.flash.updated');
    }

    public function destroy(Article $article): RedirectResponse
    {
        $this->authorize('delete', $article);
        $article->delete();

        return redirect()->route('admin.articles.index')->with('success', 'admin.flash.deleted');
    }

    public function bulkDestroy(Request $request): RedirectResponse
    {
        $this->authorize('deleteAny', Article::class);
        $ids = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:articles,id'],
        ])['ids'];
        Article::query()->whereIn('id', $ids)->delete();

        return redirect()->route('admin.articles.index')->with('success', 'admin.flash.bulkDeleted');
    }

    private function payload(ArticleRequest $request, ?Article $existing = null): array
    {
        $validated = $request->validated();
        $status = PublicationStatus::from($validated['status']);

        return [
            'author_id' => $validated['author_id'] ?? $request->user()->id,
            'category' => $validated['category'],
            'slug' => $validated['slug'],
            'title' => TranslatableInput::from($validated['title']),
            'body' => TranslatableInput::from($validated['body']),
            'cover' => $this->storePublicUpload($request->file('cover'), 'articles', $existing?->cover),
            'status' => $status,
            'published_at' => $status === PublicationStatus::Published
                ? ($validated['published_at'] ?? $existing?->published_at ?? now())
                : ($validated['published_at'] ?? null),
        ];
    }

    private function options(): array
    {
        return [
            'categories' => collect(ArticleCategory::cases())->map(fn ($c) => [
                'value' => $c->value, 'label' => $c->value,
            ])->values(),
            'statuses' => collect(PublicationStatus::cases())->map(fn ($c) => [
                'value' => $c->value, 'label' => $c->value,
            ])->values(),
        ];
    }
}
