<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\URL;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        $adminPrefix = trim((string) config('locales.admin_prefix', 'mongla'), '/');

        if ($request->is($adminPrefix, $adminPrefix.'/*')) {
            return $next($request);
        }

        $supported = config('locales.supported', ['en', 'my', 'zh']);
        $default = config('locales.default', 'my');
        $routeLocale = $request->route('locale');

        if (! is_string($routeLocale) || $routeLocale === '') {
            $saved = $request->session()->get('locale')
                ?? $request->cookie(config('locales.cookie'));

            if (
                $request->isMethod('GET')
                && $request->path() === '/'
                && is_string($saved)
                && in_array($saved, $supported, true)
                && $saved !== $default
            ) {
                return redirect('/'.$saved);
            }

            $locale = $default;
        } elseif (! in_array($routeLocale, $supported, true)) {
            abort(404);
        } else {
            $locale = $routeLocale;
        }

        app()->setLocale($locale);
        URL::defaults(['locale' => $locale]);
        $request->session()->put('locale', $locale);

        Cookie::queue(Cookie::make(
            config('locales.cookie'),
            $locale,
            60 * 24 * 365,
        ));

        return $next($request);
    }
}
