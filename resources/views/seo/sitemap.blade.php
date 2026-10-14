{!! '<'.'?xml version="1.0" encoding="UTF-8"?>' !!}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
@foreach ($paths as $path)
    @foreach ($locales as $locale)
        <url>
            <loc>{{ url('/'.$locale.$path) }}</loc>
            @foreach ($locales as $alternate)
                <xhtml:link rel="alternate" hreflang="{{ $alternate === 'zh' ? 'zh-Hans' : $alternate }}" href="{{ url('/'.$alternate.$path) }}" />
            @endforeach
            <xhtml:link rel="alternate" hreflang="x-default" href="{{ url('/my'.$path) }}" />
        </url>
    @endforeach
@endforeach
</urlset>
