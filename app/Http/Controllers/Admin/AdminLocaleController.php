<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AdminLocaleController extends Controller
{
    public function __invoke(Request $request): RedirectResponse
    {
        $locale = $request->validate([
            'locale' => ['required', 'in:'.implode(',', config('locales.supported', ['en', 'my', 'zh']))],
        ])['locale'];

        $request->session()->put('admin_locale', $locale);

        return back();
    }
}
