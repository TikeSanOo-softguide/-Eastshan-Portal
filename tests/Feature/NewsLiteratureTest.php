<?php

namespace Tests\Feature;

use App\Models\Article;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class NewsLiteratureTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DatabaseSeeder::class);
    }

    public function test_news_digest_filters_by_category_and_date(): void
    {
        $this->get('/en/news?category=announcements&from=2020-01-01&to=2030-01-01')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Public/News/Index')
                ->where('filters.category', 'announcements')
                ->has('news.data')
                ->has('news.meta.per_page')
                ->where('news.meta.per_page', 12)
                ->has('categories')
                ->missing('news.data.0.body'));
    }

    public function test_articles_index_tabs_by_category(): void
    {
        $this->get('/en/articles/knowledge')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Public/Articles/Index')
                ->where('category', 'knowledge')
                ->has('articles.data')
                ->has('categories', 3));
    }

    public function test_article_detail_includes_reading_time_and_share_url(): void
    {
        $article = Article::query()->published()->where('category', 'knowledge')->firstOrFail();

        $this->get('/en/articles/'.$article->category->value.'/'.$article->slug)
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Public/Articles/Show')
                ->where('article.slug', $article->slug)
                ->has('article.body_html')
                ->has('article.reading_time')
                ->has('article.share_url')
                ->has('article.available_locales')
                ->has('related')
                ->missing('article.created_at'));
    }

    public function test_article_missing_locale_sets_notice_flag(): void
    {
        $article = Article::query()
            ->published()
            ->where('slug', 'like', 'sample-placeholder-field-guide%')
            ->firstOrFail();

        $this->get('/zh/articles/'.$article->category->value.'/'.$article->slug)
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Public/Articles/Show')
                ->where('article.missing_translation', true)
                ->where('article.available_locales', function ($locales) {
                    $codes = collect($locales)->all();

                    return in_array('en', $codes, true)
                        && in_array('my', $codes, true)
                        && ! in_array('zh', $codes, true);
                }));
    }

    public function test_search_returns_like_results(): void
    {
        $this->get('/en/search?q=Sample')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Public/Search/Index')
                ->where('filters.q', 'Sample')
                ->has('results.data')
                ->has('results.meta'));
    }

    public function test_rss_feed_per_locale(): void
    {
        $this->get('/my/feed.xml')
            ->assertOk()
            ->assertHeader('Content-Type', 'application/rss+xml; charset=UTF-8')
            ->assertSee('<rss', false)
            ->assertSee('Sample Desk', false);
    }
}
