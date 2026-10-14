<?php

namespace Tests\Feature;

use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PublicContentPagesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DatabaseSeeder::class);
    }

    public function test_institutions_index_filters_and_paginates(): void
    {
        $this->get('/en/institutions?type=special_region&q=Amber')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Public/Institutions/Index')
                ->where('filters.type', 'special_region')
                ->where('filters.q', 'Amber')
                ->has('institutions.data')
                ->has('institutions.meta')
                ->missing('institutions.data.0.description'));
    }

    public function test_institution_detail_uses_resource_shape(): void
    {
        $this->get('/en/institutions/amber-river')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Public/Institutions/Show')
                ->has('institution.name')
                ->has('institution.description_html')
                ->has('institution.children')
                ->has('institution.leaders')
                ->missing('institution.created_at'));
    }

    public function test_leadership_page_groups_by_institution(): void
    {
        $this->get('/en/leadership')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Public/Leadership/Index')
                ->has('groups')
                ->has('groups.0.institution')
                ->has('groups.0.leaders')
                ->has('groups.0.children'));
    }

    public function test_about_pages_sanitize_body_html(): void
    {
        $this->get('/en/about/history')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Public/About/Show')
                ->where('section', 'history')
                ->has('page.body_html')
                ->where('page.body_html', fn (string $html) => ! str_contains($html, '<script>')
                    && str_contains($html, '<h2'))
                ->has('page.toc')
                ->has('related')
                ->has('siblings'));
    }

    public function test_heritage_route_renders_about_template(): void
    {
        $this->get('/en/heritage')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Public/About/Show')
                ->where('section', 'heritage'));
    }

    public function test_infrastructure_tabs_and_township_filter(): void
    {
        $this->get('/en/infrastructure/education?township=riverbend')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Public/Infrastructure/Index')
                ->where('category', 'education')
                ->where('filters.township', 'riverbend')
                ->has('summary.total')
                ->has('items.data')
                ->has('items.meta.per_page')
                ->where('items.meta.per_page', 12)
                ->has('townships'));
    }
}
