<?php

use App\Http\Controllers\Admin\AdminLocaleController;
use App\Http\Controllers\Admin\ArticleController;
use App\Http\Controllers\Admin\ContentPageController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\InfrastructureItemController;
use App\Http\Controllers\Admin\InstitutionController;
use App\Http\Controllers\Admin\LeaderController;
use App\Http\Controllers\Admin\NewsItemController;
use App\Http\Controllers\Admin\TownshipController;
use Illuminate\Support\Facades\Route;

Route::get('/', DashboardController::class)->name('dashboard');
Route::post('locale', AdminLocaleController::class)->name('locale.update');

Route::post('institutions/bulk-destroy', [InstitutionController::class, 'bulkDestroy'])->name('institutions.bulk-destroy');
Route::resource('institutions', InstitutionController::class)->except(['show']);

Route::post('leaders/bulk-destroy', [LeaderController::class, 'bulkDestroy'])->name('leaders.bulk-destroy');
Route::resource('leaders', LeaderController::class)->except(['show']);

Route::post('townships/bulk-destroy', [TownshipController::class, 'bulkDestroy'])->name('townships.bulk-destroy');
Route::resource('townships', TownshipController::class)->except(['show']);

Route::post('content-pages/bulk-destroy', [ContentPageController::class, 'bulkDestroy'])->name('content-pages.bulk-destroy');
Route::resource('content-pages', ContentPageController::class)->except(['show']);

Route::post('infrastructure/bulk-destroy', [InfrastructureItemController::class, 'bulkDestroy'])->name('infrastructure.bulk-destroy');
Route::resource('infrastructure', InfrastructureItemController::class)
    ->parameters(['infrastructure' => 'infrastructure_item'])
    ->except(['show']);

Route::post('news/bulk-destroy', [NewsItemController::class, 'bulkDestroy'])->name('news.bulk-destroy');
Route::resource('news', NewsItemController::class)
    ->parameters(['news' => 'news_item'])
    ->except(['show']);

Route::post('articles/bulk-destroy', [ArticleController::class, 'bulkDestroy'])->name('articles.bulk-destroy');
Route::resource('articles', ArticleController::class)->except(['show']);
