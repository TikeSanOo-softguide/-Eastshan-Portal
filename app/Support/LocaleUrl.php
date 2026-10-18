<?php

namespace App\Support;

class LocaleUrl
{
    public static function path(string $path = '/', ?string $locale = null): string
    {
        $locale = $locale ?: app()->getLocale();
        $default = config('locales.default', 'my');
        $path = '/'.ltrim($path, '/');

        if ($path !== '/') {
            $path = rtrim($path, '/') ?: '/';
        }

        if (! is_string($locale) || $locale === '' || $locale === $default) {
            return $path;
        }

        return $path === '/' ? '/'.$locale : '/'.$locale.$path;
    }

    public static function url(string $path = '/', ?string $locale = null): string
    {
        return url(self::path($path, $locale));
    }
}
