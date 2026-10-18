<?php

namespace Tests\Feature;

use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class HomePageTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_shares_stats_and_news(): void
    {
        $this->seed(DatabaseSeeder::class);

        $this->get('/en')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Public/Home')
                ->has('stats', fn (Assert $stats) => $stats
                    ->where('townships', 10)
                    ->has('population')
                    ->has('schools')
                    ->has('clinics')
                    ->etc())
                ->has('news', 5)
                ->has('news.0', fn (Assert $item) => $item
                    ->has('id')
                    ->has('title')
                    ->has('excerpt')
                    ->has('source_name')
                    ->has('source_url')
                    ->has('href')
                    ->missing('body')
                    ->etc())
                ->missing('articles')
                ->missing('leaders'));
    }
}
