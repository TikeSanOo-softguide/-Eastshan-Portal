<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Public/Contact/Index');
    }

    public function store(ContactRequest $request): RedirectResponse
    {
        Log::info('Sample contact form submitted.', [
            'locale' => app()->getLocale(),
            'name' => $request->string('name')->toString(),
            'email' => $request->string('email')->toString(),
        ]);

        return redirect()
            ->route('contact.create')
            ->with('success', 'contact.sent');
    }
}
