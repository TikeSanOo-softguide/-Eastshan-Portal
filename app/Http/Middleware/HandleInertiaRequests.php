<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $user->getRoleNames()->values()->all(),
                    'permissions' => $user->getAllPermissions()->pluck('name')->values()->all(),
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'locale' => app()->getLocale(),
            'locales' => config('locales.supported'),
            'seo' => [
                'url' => $request->url(),
                'alternates' => $this->alternates($request),
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    private function alternates(Request $request): array
    {
        $path = trim($request->path(), '/');
        $stripped = preg_replace('#^(en|my|zh)(/|$)#', '', $path) ?? '';
        $stripped = trim((string) $stripped, '/');
        $suffix = $stripped === '' ? '' : '/'.$stripped;
        $default = config('locales.default', 'my');
        $alternates = [];

        foreach (config('locales.supported', ['en', 'my', 'zh']) as $locale) {
            $alternates[$locale] = $locale === $default
                ? url($suffix === '' ? '/' : $suffix)
                : url('/'.$locale.$suffix);
        }

        return $alternates;
    }
}
