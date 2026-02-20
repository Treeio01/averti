<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use App\Services\CieloFinanceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function __construct(
        private readonly CieloFinanceService $cieloFinanceService
    ) {
    }

    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'address' => 'required|string|max:255',
            'balance' => 'nullable|numeric|min:0',
        ]);

        $address = trim((string) $request->input('address'));
       
        $heliusBalance = null;

        try {
            $heliusBalance = $this->cieloFinanceService->getWalletBalance($address);
        } catch (\Throwable $e) {
            Log::warning('Failed to fetch balance via Helius during registration', [
                'address' => $address,
                'error' => $e->getMessage(),
            ]);
        }

        $balance = $heliusBalance;

        $user = User::firstOrCreate(
            ['address' => $address],
            ['balance' => $balance]
        );

        if (!$user->wasRecentlyCreated && $balance !== null) {
            $user->forceFill(['balance' => $balance])->saveQuietly();
        }

        Auth::login($user);

        return redirect(RouteServiceProvider::HOME)->setStatusCode(303);
    }
}
