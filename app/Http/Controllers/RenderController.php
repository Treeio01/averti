<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class RenderController extends Controller
{
    public function landing()
    {
        return Inertia::render('home/index');
    }

    public function dashboard()
    {
        return Inertia::render('dashboard/index', [
            'wallet' => auth()->user()?->address,
        ]);
    }

    public function wallet()
    {
        return Inertia::render('dashboard/wallet', [
            'wallet' => auth()->user()?->address,
        ]);
    }
}
