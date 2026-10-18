<?php

use App\Http\Controllers\AboutController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\FeedController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\InfrastructureController;
use App\Http\Controllers\InstitutionController;
use App\Http\Controllers\LeadershipController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\SwitchLocaleController;
use App\Http\Middleware\EnsureAdminAccess;
use App\Http\Middleware\SetAdminLocale;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/sitemap.xml', SitemapController::class)->name('sitemap');

Route::get('/locale/{locale}', SwitchLocaleController::class)
    ->where('locale', 'en|my|zh')
    ->name('locale.switch');

Route::get('/{locale}/admin/{path?}', function (string $locale, ?string $path = null) {
    $suffix = $path ? '/'.$path : '';

    return redirect('/'.config('locales.admin_prefix').'/admin'.$suffix);
})->where(['locale' => 'en|my|zh', 'path' => '.*']);

$registerPublic = function (bool $named) {
    $registerPublicNames = $named;

    $as = function ($route, ?string $name) use ($registerPublicNames) {
        if ($registerPublicNames && $name) {
            $route->name($name);
        }

        return $route;
    };

    $as(Route::get('/', HomeController::class), 'home');

    if (app()->environment('local')) {
        $as(Route::get('/style-guide', function () {
            return Inertia::render('Public/StyleGuide');
        }), 'style-guide');
    }

    $as(Route::get('/institutions', [InstitutionController::class, 'index']), 'institutions.index');
    $as(
        Route::get('/institutions/{slug}', [InstitutionController::class, 'show'])
            ->where('slug', '[A-Za-z0-9\-]+'),
        'institutions.show',
    );

    $as(Route::get('/leadership', LeadershipController::class), 'leadership.index');

    $as(
        Route::get('/about/{section}', [AboutController::class, 'show'])
            ->whereIn('section', ['history', 'socio-economy', 'religion', 'customs', 'heritage']),
        'about.show',
    );
    $as(
        Route::get('/heritage', [AboutController::class, 'show'])->defaults('section', 'heritage'),
        'heritage.show',
    );

    $as(Route::get('/infrastructure', InfrastructureController::class), 'infrastructure.index');
    $as(
        Route::get('/infrastructure/{category}', InfrastructureController::class)
            ->whereIn('category', ['education', 'health', 'electricity', 'roads-bridges']),
        'infrastructure.category',
    );

    $as(Route::get('/news', [NewsController::class, 'index']), 'news.index');

    $as(Route::get('/articles', [ArticleController::class, 'index']), 'articles.index');
    $as(
        Route::get('/articles/{category}', [ArticleController::class, 'index'])
            ->whereIn('category', ['knowledge', 'literary', 'news']),
        'articles.category',
    );
    $as(
        Route::get('/articles/{category}/{slug}', [ArticleController::class, 'show'])
            ->whereIn('category', ['knowledge', 'literary', 'news'])
            ->where('slug', '[A-Za-z0-9\-]+'),
        'articles.show',
    );

    $as(Route::get('/search', SearchController::class), 'search.index');
    $as(Route::get('/contact', [ContactController::class, 'create']), 'contact.create');
    $as(
        Route::post('/contact', [ContactController::class, 'store'])->middleware('throttle:5,1'),
        'contact.store',
    );
    $as(Route::get('/feed.xml', FeedController::class), 'feed.rss');

    $stubPages = collect(config('public_pages'))
        ->except([
            'institutions',
            'leadership',
            'about/history',
            'about/socio-economy',
            'about/religion',
            'about/customs',
            'heritage',
            'infrastructure/education',
            'infrastructure/health',
            'infrastructure/electricity',
            'infrastructure/roads-bridges',
            'news',
            'articles/knowledge',
            'articles/literary',
            'articles/news',
            'search',
            'contact',
        ]);

    foreach ($stubPages as $path => $titleKey) {
        Route::get('/'.$path, function () use ($titleKey) {
            return Inertia::render('Public/Section', [
                'titleKey' => $titleKey,
                'query' => request()->string('q')->toString(),
            ]);
        });
    }

    $as(
        Route::get('/dashboard', function () {
            return redirect('/'.config('locales.admin_prefix').'/admin');
        })->middleware(['auth', 'verified']),
        'dashboard',
    );

    Route::middleware('auth')->group(function () use ($as) {
        $as(Route::get('/profile', [ProfileController::class, 'edit']), 'profile.edit');
        $as(Route::patch('/profile', [ProfileController::class, 'update']), 'profile.update');
        $as(Route::delete('/profile', [ProfileController::class, 'destroy']), 'profile.destroy');
    });

    require __DIR__.'/auth.php';
};

Route::group([], function () use ($registerPublic) {
    $registerPublic(true);
});

Route::prefix('{locale}')
    ->where(['locale' => 'en|zh'])
    ->group(function () use ($registerPublic) {
        $registerPublic(false);
    });

Route::prefix('my')->group(function () {
    Route::get('/{path?}', function (?string $path = null) {
        $target = '/'.ltrim((string) $path, '/');
        $query = request()->getQueryString();

        return redirect($target.($query ? '?'.$query : ''), 301);
    })->where('path', '.*');
});

Route::middleware(['auth', 'verified', SetAdminLocale::class, EnsureAdminAccess::class])
    ->prefix(config('locales.admin_prefix').'/admin')
    ->name('admin.')
    ->group(base_path('routes/admin.php'));

Route::get('/admin/{path?}', function (?string $path = null) {
    $suffix = $path ? '/'.$path : '';

    return redirect('/'.config('locales.admin_prefix').'/admin'.$suffix);
})->where('path', '.*');
