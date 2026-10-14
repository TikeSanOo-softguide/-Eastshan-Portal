<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AdminPermission;
use App\Enums\PublicationStatus;
use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\ContentPage;
use App\Models\InfrastructureItem;
use App\Models\Institution;
use App\Models\Leader;
use App\Models\NewsItem;
use App\Models\Township;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        abort_unless($request->user()?->can(AdminPermission::ViewDashboard->value), 403);

        $user = $request->user();
        $isAdmin = $user->can(AdminPermission::ManageInstitutions->value);

        $stats = $isAdmin
            ? [
                ['key' => 'institutions', 'label' => 'admin.stats.institutions', 'value' => Institution::query()->count(), 'href' => '/admin/institutions'],
                ['key' => 'leaders', 'label' => 'admin.stats.leaders', 'value' => Leader::query()->count(), 'href' => '/admin/leaders'],
                ['key' => 'news', 'label' => 'admin.stats.news', 'value' => NewsItem::query()->count(), 'href' => '/admin/news'],
                ['key' => 'articles', 'label' => 'admin.stats.articles', 'value' => Article::query()->count(), 'href' => '/admin/articles'],
            ]
            : [
                ['key' => 'news', 'label' => 'admin.stats.news', 'value' => NewsItem::query()->count(), 'href' => '/admin/news'],
                ['key' => 'articles', 'label' => 'admin.stats.articles', 'value' => Article::query()->count(), 'href' => '/admin/articles'],
                ['key' => 'published_news', 'label' => 'admin.stats.publishedNews', 'value' => NewsItem::query()->published()->count(), 'href' => '/admin/news'],
                ['key' => 'published_articles', 'label' => 'admin.stats.publishedArticles', 'value' => Article::query()->published()->count(), 'href' => '/admin/articles'],
            ];

        $quickActions = collect([
            ['label' => 'admin.quick.newInstitution', 'href' => '/admin/institutions/create', 'permission' => AdminPermission::ManageInstitutions->value],
            ['label' => 'admin.quick.newNews', 'href' => '/admin/news/create', 'permission' => AdminPermission::ManageNews->value],
            ['label' => 'admin.quick.newArticle', 'href' => '/admin/articles/create', 'permission' => AdminPermission::ManageArticles->value],
            ['label' => 'admin.quick.newPage', 'href' => '/admin/content-pages/create', 'permission' => AdminPermission::ManageContentPages->value],
            ['label' => 'admin.quick.newLeader', 'href' => '/admin/leaders/create', 'permission' => AdminPermission::ManageLeaders->value],
            ['label' => 'admin.quick.newTownship', 'href' => '/admin/townships/create', 'permission' => AdminPermission::ManageTownships->value],
            ['label' => 'admin.quick.newInfrastructure', 'href' => '/admin/infrastructure/create', 'permission' => AdminPermission::ManageInfrastructure->value],
        ])->filter(fn (array $action) => $user->can($action['permission']))
            ->values()
            ->take(4)
            ->all();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'chart' => $this->publishedPerMonth(),
            'activity' => $this->recentActivity($user),
            'quickActions' => $quickActions,
            'meta' => [
                'townships' => Township::query()->count(),
                'pages' => ContentPage::query()->count(),
                'infrastructure' => InfrastructureItem::query()->count(),
            ],
        ]);
    }

    /**
     * @return list<array{month: string, label: string, total: int}>
     */
    private function publishedPerMonth(): array
    {
        $start = now()->startOfMonth()->subMonths(11);
        $driver = DB::connection()->getDriverName();
        $monthExpr = $driver === 'sqlite'
            ? "strftime('%Y-%m', published_at)"
            : "DATE_FORMAT(published_at, '%Y-%m')";

        $news = NewsItem::query()
            ->whereNotNull('published_at')
            ->where('published_at', '>=', $start)
            ->select(DB::raw("{$monthExpr} as month"), DB::raw('count(*) as total'))
            ->groupBy('month')
            ->pluck('total', 'month');

        $articles = Article::query()
            ->where('status', PublicationStatus::Published)
            ->whereNotNull('published_at')
            ->where('published_at', '>=', $start)
            ->select(DB::raw("{$monthExpr} as month"), DB::raw('count(*) as total'))
            ->groupBy('month')
            ->pluck('total', 'month');

        $rows = [];

        for ($i = 0; $i < 12; $i++) {
            $month = $start->copy()->addMonths($i);
            $key = $month->format('Y-m');
            $rows[] = [
                'month' => $key,
                'label' => $month->format('M Y'),
                'total' => (int) ($news[$key] ?? 0) + (int) ($articles[$key] ?? 0),
            ];
        }

        return $rows;
    }

    /**
     * @return list<array{type: string, title: string, href: string, at: ?string}>
     */
    private function recentActivity($user): array
    {
        $items = collect();

        if ($user->can(AdminPermission::ManageNews->value)) {
            $items = $items->concat(
                NewsItem::query()->latest('updated_at')->limit(5)->get()->map(fn (NewsItem $item) => [
                    'type' => 'news',
                    'title' => $item->title,
                    'href' => '/admin/news/'.$item->id.'/edit',
                    'at' => $item->updated_at?->toIso8601String(),
                ])
            );
        }

        if ($user->can(AdminPermission::ManageArticles->value)) {
            $items = $items->concat(
                Article::query()->latest('updated_at')->limit(5)->get()->map(fn (Article $item) => [
                    'type' => 'article',
                    'title' => $item->title,
                    'href' => '/admin/articles/'.$item->id.'/edit',
                    'at' => $item->updated_at?->toIso8601String(),
                ])
            );
        }

        if ($user->can(AdminPermission::ManageInstitutions->value)) {
            $items = $items->concat(
                Institution::query()->latest('updated_at')->limit(5)->get()->map(fn (Institution $item) => [
                    'type' => 'institution',
                    'title' => $item->name,
                    'href' => '/admin/institutions/'.$item->id.'/edit',
                    'at' => $item->updated_at?->toIso8601String(),
                ])
            );
        }

        if ($user->can(AdminPermission::ManageContentPages->value)) {
            $items = $items->concat(
                ContentPage::query()->latest('updated_at')->limit(5)->get()->map(fn (ContentPage $item) => [
                    'type' => 'page',
                    'title' => $item->title,
                    'href' => '/admin/content-pages/'.$item->id.'/edit',
                    'at' => $item->updated_at?->toIso8601String(),
                ])
            );
        }

        return $items->sortByDesc('at')->take(8)->values()->all();
    }
}
