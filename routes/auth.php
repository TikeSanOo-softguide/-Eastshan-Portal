<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Route;

$publicNames = $registerPublicNames ?? true;

$as = function ($route, string $name) use ($publicNames) {
    if ($publicNames) {
        $route->name($name);
    }

    return $route;
};

Route::middleware('guest')->group(function () use ($as) {
    $as(
        Route::get('register', [RegisteredUserController::class, 'create']),
        'register',
    );

    Route::post('register', [RegisteredUserController::class, 'store']);

    $as(
        Route::get('login', [AuthenticatedSessionController::class, 'create']),
        'login',
    );

    Route::post('login', [AuthenticatedSessionController::class, 'store'])
        ->middleware('throttle:5,1');

    $as(
        Route::get('forgot-password', [PasswordResetLinkController::class, 'create']),
        'password.request',
    );

    $as(
        Route::post('forgot-password', [PasswordResetLinkController::class, 'store']),
        'password.email',
    );

    $as(
        Route::get('reset-password/{token}', [NewPasswordController::class, 'create']),
        'password.reset',
    );

    $as(
        Route::post('reset-password', [NewPasswordController::class, 'store']),
        'password.store',
    );
});

Route::middleware('auth')->group(function () use ($as) {
    $as(
        Route::get('verify-email', EmailVerificationPromptController::class),
        'verification.notice',
    );

    $as(
        Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
            ->middleware(['signed', 'throttle:6,1']),
        'verification.verify',
    );

    $as(
        Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
            ->middleware('throttle:6,1'),
        'verification.send',
    );

    $as(
        Route::get('confirm-password', [ConfirmablePasswordController::class, 'show']),
        'password.confirm',
    );

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    $as(
        Route::put('password', [PasswordController::class, 'update']),
        'password.update',
    );

    $as(
        Route::post('logout', [AuthenticatedSessionController::class, 'destroy']),
        'logout',
    );
});
