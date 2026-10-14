<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\NewsItem;
use Illuminate\Http\Response;

class FeedController extends Controller
{
    public function __invoke(string $locale): Response
    {
        abort_unless(in_array($locale, config('locales.supported', ['en', 'my', 'zh']), true), 404);

        app()->setLocale($locale);

        $news = NewsItem::query()->published()->ordered()->limit(30)->get();
        $articles = Article::query()->published()->with('author:id,name')->ordered()->limit(20)->get();

        $channelLink = url('/'.$locale);
        $feedLink = url('/'.$locale.'/feed.xml');

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
