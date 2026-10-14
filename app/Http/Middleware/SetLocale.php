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
        $locale = $request->route('locale');

        if (! is_string($locale)) {
            return $next($request);
        }

        if (! in_array($locale, config('locales.supported'), true)) {
            abort(404);
        }

        app()->setLocale($locale);
        URL::defaults(['locale' => $locale]);

        if ($request->is('*/admin', '*/admin/*')) {
            $request->session()->put('admin_locale', $locale);

            return $next($request);
        }

        $request->session()->put('locale', $locale);

        Cookie::queue(Cookie::make(
            config('locales.cookie'),
            $locale,
            60 * 24 * 365,
        ));

        return $next($request);
    }
}
