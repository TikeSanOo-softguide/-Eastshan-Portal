<?php

namespace App\Providers;

use App\Contracts\SiteSearcher;
use App\Enums\UserRole;
use App\Models\Article;
use App\Models\ContentPage;
use App\Models\InfrastructureItem;
use App\Models\Institution;
use App\Models\Leader;
use App\Models\NewsItem;
use App\Models\Township;
use App\Services\Search\LikeSiteSearcher;
use App\Support\PublicCache;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Spatie\Translatable\Facades\Translatable;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Swap LikeSiteSearcher for a Scout-backed implementation later.
        $this->app->bind(SiteSearcher::class, LikeSiteSearcher::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Translatable::fallback(
            fallbackLocale: config('locales.fallback.0', 'my'),
            fallbackAny: false,
        );

        Gate::before(function ($user, string $ability) {
            if (method_exists($user, 'hasRole') && $user->hasRole(UserRole::Admin->value)) {
                return true;
            }

            return null;
        });

        $flushPublicCache = static function (): void {
            PublicCache::flush();
        };

        foreach ([Article::class, ContentPage::class, InfrastructureItem::class, Institution::class, Leader::class, NewsItem::class, Township::class] as $model) {
            $model::saved($flushPublicCache);
            $model::deleted($flushPublicCache);
        }
    }
}
