<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\Article;
use App\Models\Institution;
use App\Models\NewsItem;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AdminAccessTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DatabaseSeeder::class);
    }

    public function test_guests_cannot_access_admin(): void
    {
        app('url')->defaults(['locale' => '']);

        $this->get('/mongla/admin')->assertRedirect('/my/login');
        $this->get('/my/admin')->assertRedirect('/mongla/admin');
    }

    public function test_admin_can_open_dashboard_and_institutions(): void
    {
        $admin = User::query()->where('email', 'admin@example.com')->firstOrFail();

        $this->actingAs($admin)
            ->get('/mongla/admin')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Admin/Dashboard'));

        $this->actingAs($admin)
            ->get('/mongla/admin/institutions')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Admin/Institutions/Index'));
    }

    public function test_editor_can_manage_news_and_articles_only(): void
    {
        $editor = User::query()->where('email', 'editor@example.com')->firstOrFail();

        $this->actingAs($editor)
            ->get('/mongla/admin')
            ->assertOk();

        $this->actingAs($editor)
            ->get('/mongla/admin/news')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Admin/News/Index'));

        $this->actingAs($editor)
            ->get('/mongla/admin/articles')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Admin/Articles/Index'));

        $this->actingAs($editor)
            ->get('/mongla/admin/institutions')
            ->assertForbidden();

        $this->actingAs($editor)
            ->get('/mongla/admin/leaders')
            ->assertForbidden();

        $this->actingAs($editor)
            ->get('/mongla/admin/townships')
            ->assertForbidden();

        $this->actingAs($editor)
            ->get('/mongla/admin/content-pages')
            ->assertForbidden();

        $this->actingAs($editor)
            ->get('/mongla/admin/infrastructure')
            ->assertForbidden();
    }

    public function test_editor_cannot_update_institutions_via_policy(): void
    {
        $editor = User::query()->where('email', 'editor@example.com')->firstOrFail();
        $institution = Institution::query()->firstOrFail();

        $this->actingAs($editor)
            ->put('/mongla/admin/institutions/'.$institution->id, [
                'name' => ['en' => 'Hacked', 'my' => 'Hacked', 'zh' => 'Hacked'],
                'description' => ['en' => 'x', 'my' => 'x', 'zh' => 'x'],
                'type' => $institution->type->value,
                'slug' => $institution->slug.'-hacked',
                'is_active' => true,
            ])
            ->assertForbidden();
    }

    public function test_editor_can_create_and_update_news_item(): void
    {
        $editor = User::query()->where('email', 'editor@example.com')->firstOrFail();
        $categoryId = \App\Models\Category::query()->where('type', 'news')->value('id');

        $this->actingAs($editor)
            ->post('/mongla/admin/news', [
                'title' => ['en' => 'Created sample', 'my' => 'Created my', 'zh' => 'Created zh'],
                'excerpt' => ['en' => 'Short excerpt', 'my' => 'Short excerpt', 'zh' => 'Short excerpt'],
                'category_id' => $categoryId,
                'source_name' => 'Sample Desk',
                'source_url' => 'https://example.com/created',
                'is_published' => false,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('news_items', [
            'source_url' => 'https://example.com/created',
        ]);
    }

    public function test_editor_can_update_news_item(): void
    {
        $editor = User::query()->where('email', 'editor@example.com')->firstOrFail();
        $news = NewsItem::query()->firstOrFail();

        $this->actingAs($editor)
            ->put('/mongla/admin/news/'.$news->id, [
                'title' => ['en' => 'Updated sample', 'my' => 'Updated my', 'zh' => 'Updated zh'],
                'excerpt' => ['en' => 'Excerpt', 'my' => 'Excerpt', 'zh' => 'Excerpt'],
                'category_id' => $news->category_id,
                'source_name' => 'Sample Desk',
                'source_url' => 'https://example.com/updated',
                'is_published' => true,
                'published_at' => now()->toDateTimeString(),
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('news_items', [
            'id' => $news->id,
            'source_url' => 'https://example.com/updated',
        ]);
    }

    public function test_admin_can_bulk_delete_articles(): void
    {
        $admin = User::query()->where('email', 'admin@example.com')->firstOrFail();
        $ids = Article::query()->limit(2)->pluck('id')->all();

        $this->actingAs($admin)
            ->post('/mongla/admin/articles/bulk-destroy', ['ids' => $ids])
            ->assertRedirect(route('admin.articles.index'));

        foreach ($ids as $id) {
            $this->assertDatabaseMissing('articles', ['id' => $id]);
        }
    }

    public function test_unverified_user_is_redirected_from_admin(): void
    {
        $user = User::factory()->unverified()->create();
        $user->assignRole(UserRole::Editor->value);

        $this->actingAs($user)
            ->get('/mongla/admin')
            ->assertRedirect('/en/verify-email');
    }

    public function test_user_without_admin_permission_is_forbidden(): void
    {
        Role::findOrCreate('viewer');
        $user = User::factory()->create();
        $user->assignRole('viewer');

        $this->actingAs($user)
            ->get('/mongla/admin')
            ->assertForbidden();
    }
}
