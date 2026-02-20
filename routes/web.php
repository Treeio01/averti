<?php

use App\Http\Controllers\RenderController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->get('/', [RenderController::class, 'landing'])->name('landing');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [RenderController::class, 'dashboard'])->name('dashboard');
    Route::get('/dashboard/wallet', [RenderController::class, 'wallet'])->name('wallet');
});

require __DIR__ . '/auth.php';
