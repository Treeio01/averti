<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Services\CieloFinanceService;
use App\Services\OpenAIService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WalletRefreshController extends Controller
{
    public function __construct(
        private readonly CieloFinanceService $cieloFinanceService,
        private readonly OpenAIService $openAIService
    ) {
    }

    public function __invoke(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user || !$user->address) {
            return response()->json([
                'status' => 'error',
                'message' => 'Wallet address is missing for the current user.',
            ], 422);
        }

        $stats = [];
        $rawTradingData = null;
        try {
            $bundle = $this->cieloFinanceService->getWalletTradingStatsWithRaw($user->address);
            $stats = $bundle['stats'] ?? [];
            $rawTradingData = $bundle['raw'] ?? null;
        } catch (\Throwable $e) {
            Log::warning('Wallet refresh: failed to fetch trading stats', [
                'address' => $user->address,
                'error' => $e->getMessage(),
            ]);
        }

        $balance = $user->balance;
        try {
            $heliusBalance = $this->cieloFinanceService->getWalletBalance($user->address);
            if ($heliusBalance !== null) {
                $balance = $heliusBalance;
            }
        } catch (\Throwable $e) {
            Log::warning('Wallet refresh: failed to fetch balance via Helius', [
                'address' => $user->address,
                'error' => $e->getMessage(),
            ]);
        }

        $aiInsight = null;
        if ($rawTradingData !== null) {
            try {
                $aiInsight = $this->openAIService->generateRiskInsight($rawTradingData);
            } catch (\Throwable $e) {
                Log::warning('Wallet refresh: failed to generate AI insight', [
                    'address' => $user->address,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        $updates = array_filter([
            'balance' => $balance,
            'pnl' => $stats['pnl'] ?? null,
            'winrate' => $stats['winrate'] ?? null,
            'trades' => $stats['trades'] ?? $stats['swaps_count'] ?? null,
            'tokens_traded' => $stats['tokens_traded'] ?? null,
            'avg_pnl_per_trade' => $stats['avg_pnl_per_trade'] ?? null,
          
        ], static fn ($value) => $value !== null);

        if ($updates !== []) {
            $user->forceFill($updates)->save();
        }

        $responseStats = [
            'pnl' => $updates['pnl'] ?? $user->pnl,
            'winrate' => $updates['winrate'] ?? $user->winrate,
            'trades' => $updates['trades'] ?? $user->trades,
            'tokens_traded' => $updates['tokens_traded'] ?? $user->tokens_traded,
            'avg_pnl_per_trade' => $updates['avg_pnl_per_trade'] ?? $user->avg_pnl_per_trade,
        ];

       

        return response()->json([
            'status' => 'ok',
            'message' => 'Wallet stats refreshed',
            'data' => [
                'address' => $user->address,
                'balance' => $balance,
                'stats' => $responseStats,
                'raw' => $rawTradingData,
               
                'refreshed_at' => now()->toIso8601String(),
            ],
        ]);
    }
}
