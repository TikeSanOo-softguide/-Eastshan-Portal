<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Institution;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function __invoke(): Response
    {
        $locales = config('locales.supported', ['en', 'my', 'zh']);
        $paths = [
            '',
            '/institutions',
            '/leadership',
            '/about/history',
            '/about/socio-economy',
            '/about/religion',
            '/about/customs',
            '/heritage',
            '/infrastructure/education',
            '/infrastructure/health',
            '/infrastructure/electricity',
            '/infrastructure/roads-bridges',
            '/news',
            '/articles/knowledge',
            '/articles/literary',
            '/articles/news',
            '/contact',
        ];

        foreach (Institution::query()->active()->pluck('slug') as $slug) {
            $paths[] = '/institutions/'.$slug;
        }

        foreach (Article::query()->published()->get(['category', 'slug']) as $article) {
            $paths[] = '/articles/'.$article->category->value.'/'.$article->slug;
        }

        $xml = view('seo.sitemap', [
            'locales' => $locales,
            'paths' => array_values(array_unique($paths)),
        ])->render();

        return response($xml, 200, [
            'Content-Type' => 'application/xml; charset=UTF-8',
        ]);
    }
}
