<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class LocaleRedirectController extends Controller
{
    public function __invoke(Request $request): RedirectResponse
    {
        $supported = config('locales.supported');
        $locale = $request->session()->get('locale')
            ?? $request->cookie(config('locales.cookie'));

        if (! is_string($locale) || ! in_array($locale, $supported, true)) {
            $locale = config('locales.default');
        }

        return redirect('/'.$locale);
    }
}
