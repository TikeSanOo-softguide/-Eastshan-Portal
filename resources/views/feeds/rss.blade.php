{!! '<'.'?xml version="1.0" encoding="UTF-8"?>' !!}
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>{{ $channelTitle }}</title>
        <link>{{ $channelLink }}</link>
        <description>{{ $channelDescription }}</description>
        <language>{{ $locale === 'zh' ? 'zh-cn' : $locale }}</language>
        <atom:link href="{{ $feedLink }}" rel="self" type="application/rss+xml" />
        @foreach ($news as $item)
            <item>
                <title>{{ $item->title }}</title>
                <link>{{ url('/'.$locale.'/news') }}</link>
                <guid isPermaLink="false">news-{{ $item->id }}-{{ $locale }}</guid>
                <pubDate>{{ optional($item->published_at)->toRssString() }}</pubDate>
                <description>{{ $item->excerpt }} @if($item->source_name) [Source: {{ $item->source_name }}] @endif</description>
                @if ($item->source_url)
                    <source url="{{ $item->source_url }}">{{ $item->source_name ?: 'Source' }}</source>
                @endif
            </item>
        @endforeach
        @foreach ($articles as $article)
            <item>
                <title>{{ $article->title }}</title>
                <link>{{ url('/'.$locale.'/articles/'.$article->category->value.'/'.$article->slug) }}</link>
                <guid isPermaLink="true">{{ url('/'.$locale.'/articles/'.$article->category->value.'/'.$article->slug) }}</guid>
                <pubDate>{{ optional($article->published_at)->toRssString() }}</pubDate>
                <description>{{ \Illuminate\Support\Str::limit(strip_tags((string) $article->body), 200) }}</description>
                @if ($article->author)
                    <author>{{ $article->author->name }}</author>
                @endif
            </item>
        @endforeach
    </channel>
</rss>
