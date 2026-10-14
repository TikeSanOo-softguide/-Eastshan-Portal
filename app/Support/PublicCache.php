<?php

namespace App\Support;

use Closure;
use Illuminate\Support\Facades\Cache;

/**
 * Public page cache keyed per locale.
 * Uses cache tags (locale + public) when the store supports them (Redis, Memcached).
 * Otherwise bumps a per-locale version so file/database/array stores stay correct.
 */
class PublicCache
{
    public static function remember(string $key, Closure $callback, int $seconds = 300): mixed
    {
        $locale = app()->getLocale();

        if (self::supportsTags()) {
            return Cache::tags(self::tags($locale))->remember($key, $seconds, $callback);
        }

        $version = (int) Cache::get(self::versionKey($locale), 1);

        return Cache::remember("public:{$locale}:v{$version}:{$key}", $seconds, $callback);
    }

    public static function flush(?string $locale = null): void
    {
        $locales = $locale ? [$locale] : config('locales.supported', ['en', 'my', 'zh']);

        if (self::supportsTags()) {
            if ($locale) {
                Cache::tags(["locale:{$locale}"])->flush();

                return;
            }

            Cache::tags(['public'])->flush();

            return;
        }

        foreach ($locales as $code) {
            $versionKey = self::versionKey($code);
            Cache::forever($versionKey, ((int) Cache::get($versionKey, 1)) + 1);
        }
    }

    /**
     * @return list<string>
     */
    private static function tags(string $locale): array
    {
        return ['public', "locale:{$locale}"];
    }

    private static function versionKey(string $locale): string
    {
        return "public-version:{$locale}";
    }

    private static function supportsTags(): bool
    {
        return method_exists(Cache::getStore(), 'tags');
    }
}
