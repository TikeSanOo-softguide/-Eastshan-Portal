<?php

use App\Http\Controllers\AboutController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\FeedController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\InfrastructureController;
use App\Http\Controllers\InstitutionController;
use App\Http\Controllers\LeadershipController;
use App\Http\Controllers\LocaleRedirectController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\SitemapController;
use App\Http\Middleware\EnsureAdminAccess;
use App\Http\Middleware\SetAdminLocale;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', LocaleRedirectController::class)->name('locale.redirect');
Route::get('/sitemap.xml', SitemapController::class)->name('sitemap');

Route::prefix('{locale}')
    ->where(['locale' => 'en|my|zh'])
    ->group(function () {
        Route::get('/', HomeController::class)->name('home');

        if (app()->environment('local')) {
            Route::get('/style-guide', function () {
                return Inertia::render('Public/StyleGuide');
            })->name('style-guide');
        }

        Route::get('/institutions', [InstitutionController::class, 'index'])->name('institutions.index');
        Route::get('/institutions/{slug}', [InstitutionController::class, 'show'])
            ->where('slug', '[A-Za-z0-9\-]+')
            ->name('institutions.show');

        Route::get('/leadership', LeadershipController::class)->name('leadership.index');

        Route::get('/about/{section}', [AboutController::class, 'show'])
            ->whereIn('section', ['history', 'socio-economy', 'religion', 'customs', 'heritage'])
            ->name('about.show');
        Route::get('/heritage', [AboutController::class, 'show'])
            ->defaults('section', 'heritage')
            ->name('heritage.show');

        Route::get('/infrastructure', InfrastructureController::class)->name('infrastructure.index');
        Route::get('/infrastructure/{category}', InfrastructureController::class)
            ->whereIn('category', ['education', 'health', 'electricity', 'roads-bridges'])
            ->name('infrastructure.category');

        Route::get('/news', [NewsController::class, 'index'])->name('news.index');

        Route::get('/articles', [ArticleController::class, 'index'])->name('articles.index');
        Route::get('/articles/{category}', [ArticleController::class, 'index'])
            ->whereIn('category', ['knowledge', 'literary', 'news'])
            ->name('articles.category');
        Route::get('/articles/{category}/{slug}', [ArticleController::class, 'show'])
            ->whereIn('category', ['knowledge', 'literary', 'news'])
            ->where('slug', '[A-Za-z0-9\-]+')
            ->name('articles.show');

        Route::get('/search', SearchController::class)->name('search.index');
        Route::get('/contact', [ContactController::class, 'create'])->name('contact.create');
        Route::post('/contact', [ContactController::class, 'store'])
            ->middleware('throttle:5,1')
            ->name('contact.store');
        Route::get('/feed.xml', FeedController::class)->name('feed.rss');

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

        Route::get('/dashboard', function () {
            return redirect('/'.config('locales.admin_prefix').'/admin');
        })->middleware(['auth', 'verified'])->name('dashboard');

        Route::get('/admin/{path?}', function (string $locale, ?string $path = null) {
            $suffix = $path ? '/'.$path : '';

            return redirect('/'.config('locales.admin_prefix').'/admin'.$suffix);
        })->where('path', '.*');

        Route::middleware('auth')->group(function () {
            Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
            Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
            Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
        });

        require __DIR__.'/auth.php';
    });

Route::middleware(['auth', 'verified', SetAdminLocale::class, EnsureAdminAccess::class])
    ->prefix(config('locales.admin_prefix').'/admin')
    ->name('admin.')
    ->group(base_path('routes/admin.php'));

Route::get('/admin/{path?}', function (?string $path = null) {
    $suffix = $path ? '/'.$path : '';

    return redirect('/'.config('locales.admin_prefix').'/admin'.$suffix);
})->where('path', '.*');
