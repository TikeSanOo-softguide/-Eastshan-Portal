<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\NewsItem;
use App\Support\LocaleUrl;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class FeedController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $supported = config('locales.supported', ['en', 'my', 'zh']);
        $locale = $request->route('locale');
        $locale = is_string($locale) && in_array($locale, $supported, true)
            ? $locale
            : app()->getLocale();

        abort_unless(in_array($locale, $supported, true), 404);

        app()->setLocale($locale);

        $news = NewsItem::query()->published()->ordered()->limit(30)->get();
        $articles = Article::query()->published()->with('author:id,name')->ordered()->limit(20)->get();

        $channelLink = LocaleUrl::url('/', $locale);
        $feedLink = LocaleUrl::url('/feed.xml', $locale);

        $xml = view('feeds.rss', [
            'locale' => $locale,
            'channelTitle' => config('app.name').' — '.$locale,
            'channelLink' => $channelLink,
            'feedLink' => $feedLink,
            'channelDescription' => 'Sample Eastshan portal feed (news digests and original articles).',
            'news' => $news,
            'articles' => $articles,
        ])->render();

        return response($xml, 200, [
            'Content-Type' => 'application/rss+xml; charset=UTF-8',
        ]);
    }
}
