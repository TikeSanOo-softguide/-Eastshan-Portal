<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class NewsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Public/News/Index');
    }
}
