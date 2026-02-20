<?php

namespace App\Observers;

use App\Models\User;
use App\Services\CieloFinanceService;
use App\Services\OpenAIService;
use Illuminate\Support\Facades\Log;

class UserObserver
{
    public function __construct(
        private readonly CieloFinanceService $cieloFinanceService,
        private readonly OpenAIService $openAIService
    ) {
    }

    public function created(User $user): void
    {
        $this->syncWalletData($user);
    }

    protected function syncWalletData(User $user): void
    {
        if (!$user->address) {
            return;
        }

        $stats = [];
        $rawTradingData = null;
        try {
            $bundle = $this->cieloFinanceService->getWalletTradingStatsWithRaw($user->address);
            $stats = $bundle['stats'] ?? [];
            $rawTradingData = $bundle['raw'] ?? null;
        } catch (\Throwable $e) {
            Log::warning('Failed to pull wallet stats', [
                'address' => $user->address,
                'error' => $e->getMessage(),
            ]);
        }

        $balance = $user->balance;

        $aiInsight = null;
        if ($rawTradingData !== null) {
            try {
                $aiInsight = $this->openAIService->generateRiskInsight($rawTradingData);
            } catch (\Throwable $e) {
                Log::warning('Failed to generate AI insight', [
                    'address' => $user->address,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        try {
            $heliusBalance = $this->cieloFinanceService->getWalletBalance($user->address);
            if ($heliusBalance !== null) {
                $balance = $heliusBalance;
            }
        } catch (\Throwable $e) {
            Log::warning('Failed to fetch wallet balance via Helius inside observer', [
                'address' => $user->address,
                'error' => $e->getMessage(),
            ]);
        }

        $updates = array_filter([
            'balance' => $balance,
            'pnl' => $stats['pnl'] ?? null,
            'winrate' => $stats['winrate'] ?? null,
            'trades' => $stats['trades'] ?? $stats['swaps_count'] ?? null,
            'tokens_traded' => $stats['tokens_traded'] ?? null,
            'avg_pnl_per_trade' => $stats['avg_pnl_per_trade'] ?? null,
            'can_give_sum' => $this->calculateCanGiveSum($balance),
            
        ], static fn ($value) => $value !== null);

        if (empty($updates)) {
            return;
        }

        $user->forceFill($updates)->saveQuietly();
    }

    private function calculateCanGiveSum(?float $balance): ?float
    {
        if ($balance === null || $balance <= 0) {
            return null;
        }

        $percentage = random_int(7500, 8000) / 10000;

        return round($balance * $percentage, 8);
    }
}
