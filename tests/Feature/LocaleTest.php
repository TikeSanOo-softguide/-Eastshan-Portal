<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class LocaleTest extends TestCase
{
    use RefreshDatabase;
    public function test_root_renders_the_default_locale_without_a_prefix(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Public/Home')
                ->where('locale', 'my'));
    }

    public function test_root_prefers_the_session_locale_over_the_cookie(): void
    {
        $this->withSession(['locale' => 'zh'])
            ->withCookie('locale', 'en')
            ->get('/')
            ->assertRedirect('/zh');
    }

    public function test_root_uses_the_locale_cookie_when_the_session_is_empty(): void
    {
        $this->withCookie('locale', 'en')
            ->get('/')
            ->assertRedirect('/en');
    }

    public function test_root_ignores_an_unknown_saved_locale(): void
    {
        $this->withCookie('locale', 'fr')
            ->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Public/Home')
                ->where('locale', 'my'));
    }

    public function test_prefixed_home_shares_the_locale_and_stores_it(): void
    {
        $this->get('/zh')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Public/Home')
                ->where('locale', 'zh')
                ->where('locales', ['en', 'my', 'zh']))
            ->assertCookie('locale', 'zh');
    }

    public function test_unknown_locale_prefix_is_not_found(): void
    {
        $this->get('/fr')->assertNotFound();
    }

    public function test_translation_files_share_the_same_keys(): void
    {
        $en = $this->flatten(json_decode(file_get_contents(resource_path('js/locales/en.json')), true));
        $my = $this->flatten(json_decode(file_get_contents(resource_path('js/locales/my.json')), true));
        $zh = $this->flatten(json_decode(file_get_contents(resource_path('js/locales/zh.json')), true));

        $this->assertSame(array_keys($en), array_keys($my));
        $this->assertSame(array_keys($en), array_keys($zh));
    }

    /**
     * @param  array<string, mixed>  $tree
     * @return array<string, string>
     */
    private function flatten(array $tree, string $prefix = ''): array
    {
        $flat = [];

        foreach ($tree as $key => $value) {
            $path = $prefix === '' ? (string) $key : $prefix.'.'.$key;

            if (is_array($value)) {
                $flat += $this->flatten($value, $path);

                continue;
            }

            $flat[$path] = (string) $value;
        }

        ksort($flat);

        return $flat;
    }
}
