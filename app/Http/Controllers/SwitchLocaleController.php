<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;

class SwitchLocaleController extends Controller
{
    public function __invoke(Request $request, string $locale): RedirectResponse
    {
        $supported = config('locales.supported', ['en', 'my', 'zh']);
        $default = config('locales.default', 'my');

        abort_unless(in_array($locale, $supported, true), 404);

        $request->session()->put('locale', $locale);

        Cookie::queue(Cookie::make(
            config('locales.cookie'),
            $locale,
            60 * 24 * 365,
        ));

        $to = $request->query('to', '/');

        if (! is_string($to) || ! str_starts_with($to, '/') || str_starts_with($to, '//')) {
            $to = '/';
        }

        $parts = parse_url($to);
        $path = $parts['path'] ?? '/';
        $query = isset($parts['query']) ? '?'.$parts['query'] : '';

        $path = preg_replace('#^/(en|my|zh)(?=/|$)#', '', $path) ?: '/';

        if ($path === '') {
            $path = '/';
        }

        if ($locale === $default) {
            return redirect($path.$query);
        }

        $prefixed = $path === '/' ? '/'.$locale : '/'.$locale.$path;

        return redirect($prefixed.$query);
    }
}
