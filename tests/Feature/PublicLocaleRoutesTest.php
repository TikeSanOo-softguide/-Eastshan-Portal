<?php

namespace Tests\Feature;

use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PublicLocaleRoutesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DatabaseSeeder::class);
    }

    public function test_main_public_routes_render_in_each_locale(): void
    {
        $paths = [
            '',
            '/news',
            '/articles/knowledge',
            '/articles/literary',
            '/articles/news',
            '/institutions',
            '/leadership',
            '/about/history',
            '/infrastructure/education',
            '/search',
            '/contact',
        ];

        foreach (['my', 'en', 'zh'] as $locale) {
            foreach ($paths as $path) {
                $url = $locale === 'my'
                    ? ($path === '' ? '/' : $path)
                    : '/'.$locale.$path;

                $this->get($url)->assertOk();
            }
        }

        $this->get('/my/news')->assertRedirect('/news');
    }

    public function test_unknown_path_renders_translated_not_found_page(): void
    {
        $this->get('/not-a-real-page')
            ->assertNotFound()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Errors/Http')
                ->where('status', 404)
                ->where('locale', 'my'));
    }

    public function test_sitemap_lists_locale_alternates(): void
    {
        $this->get('/sitemap.xml')
            ->assertOk()
            ->assertHeader('Content-Type', 'application/xml; charset=UTF-8')
            ->assertSee('/en/news', false)
            ->assertSee('/zh/news', false)
            ->assertDontSee('/my/news', false)
            ->assertSee('hreflang="zh-Hans"', false);
    }
}
