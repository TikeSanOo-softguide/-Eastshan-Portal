<?php

use App\Http\Middleware\SetLocale;
use App\Support\LocaleUrl;
use Illuminate\Contracts\Auth\Middleware\AuthenticatesRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            SetLocale::class,
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->prependToPriorityList(AuthenticatesRequests::class, SetLocale::class);

        $middleware->redirectGuestsTo(function (Request $request) {
            $adminPrefix = config('locales.admin_prefix', 'mongla');
            $onAdmin = $request->is($adminPrefix, $adminPrefix.'/*');
            $locale = $onAdmin
                ? ($request->session()->get('admin_locale') ?? config('locales.default', 'my'))
                : ($request->route('locale')
                    ?? $request->session()->get('locale')
                    ?? config('locales.default', 'my'));

            if (! is_string($locale) || ! in_array($locale, config('locales.supported', ['en', 'my', 'zh']), true)) {
                $locale = config('locales.default', 'my');
            }

            return LocaleUrl::path('/login', $locale);
        });
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->respond(function (Response $response, Throwable $exception, Request $request) {
            $status = $response->getStatusCode();
            $showServerError = $status === 500 && ! config('app.debug');

            if (! in_array($status, [404], true) && ! $showServerError) {
                return $response;
            }

            if ($request->expectsJson() && ! $request->header('X-Inertia')) {
                return $response;
            }

            $supported = config('locales.supported', ['en', 'my', 'zh']);
            $segment = $request->segment(1);
            $saved = $request->hasSession()
                ? $request->session()->get('locale')
                : null;
            $saved ??= $request->cookie(config('locales.cookie'));
            $locale = in_array($segment, ['en', 'zh', 'my'], true)
                ? $segment
                : (is_string($saved) && in_array($saved, $supported, true)
                    ? $saved
                    : config('locales.default', 'my'));
            app()->setLocale($locale);

            return Inertia::render('Errors/Http', [
                'status' => $status,
                'locale' => $locale,
            ])->toResponse($request)->setStatusCode($status);
        });
    })->create();
