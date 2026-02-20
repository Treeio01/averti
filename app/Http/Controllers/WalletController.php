<?php

namespace App\Http\Controllers;

use App\Http\Requests\AnalyzeWalletRequest;
use App\Http\Resources\TokenResource;
use App\Services\CieloFinanceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class WalletController extends Controller
{
    public function __construct(
        private readonly CieloFinanceService $cieloFinanceService
    ) {
    }

    public function analyze(AnalyzeWalletRequest $request): JsonResponse
    {
        try {
            $walletAddress = $request->validated()['wallet_address'];

            Log::info('Wallet analysis started', [
                'wallet_address' => $walletAddress,
            ]);

            $tokens = $this->cieloFinanceService->getWalletTokensPnL($walletAddress);

            $tradingStats = null;
            try {
                $tradingStats = $this->cieloFinanceService->getWalletTradingStats($walletAddress);
                
                Log::info('Trading stats fetched', [
                    'wallet_address' => $walletAddress,
                    'stats' => $tradingStats,
                ]);
            } catch (\Exception $e) {
                Log::warning('Failed to fetch trading stats', [
                    'wallet_address' => $walletAddress,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);
                
                // Возвращаем дефолтные значения вместо null
                $tradingStats = [
                    'pnl' => 0,
                    'winrate' => 0,
                    'swaps_count' => 0,
                    'average_holding_time_sec' => 0,
                    'consecutive_trading_days' => 0,
                ];
            }

            // Если нет токенов, все равно возвращаем stats (может быть дефолтные значения)
            if (empty($tokens)) {
                Log::info('No tokens found for wallet', [
                    'wallet_address' => $walletAddress,
                    'has_stats' => $tradingStats !== null,
                ]);
                
                return response()->json([
                    'success' => true,
                    'trades' => [],
                    'stats' => $tradingStats ?? [
                        'pnl' => 0,
                        'winrate' => 0,
                        'swaps_count' => 0,
                        'average_holding_time_sec' => 0,
                        'consecutive_trading_days' => 0,
                    ],
                ]);
            }

            usort($tokens, function ($a, $b) {
                $pnlA = (float) ($a['total_pnl_usd'] ?? 0);
                $pnlB = (float) ($b['total_pnl_usd'] ?? 0);
                return $pnlB <=> $pnlA;
            });

            $topTokens = array_slice($tokens, 0, 6);

            $processedTokens = [];
            foreach ($topTokens as $token) {
                if (!isset($token['image']) && isset($token['logo'])) {
                    $token['image'] = $token['logo'];
                }

                $tokenResource = new TokenResource($token);
                $processedToken = $tokenResource->toArray($request);
                $processedTokens[] = $processedToken;
            }

            Log::info('Wallet analysis completed', [
                'wallet_address' => $walletAddress,
                'tokens_count' => count($processedTokens),
                'has_stats' => $tradingStats !== null,
            ]);

            return response()->json([
                'success' => true,
                'trades' => $processedTokens,
                'stats' => $tradingStats,
            ]);

        } catch (\RuntimeException $e) {
            Log::error('Wallet analysis failed', [
                'wallet_address' => $walletAddress ?? 'unknown',
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);

        } catch (\Exception $e) {
            Log::error('Wallet analysis unexpected error', [
                'wallet_address' => $walletAddress ?? 'unknown',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An unexpected error occurred. Please try again later.',
            ], 500);
        }
    }
}
