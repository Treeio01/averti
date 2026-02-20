<?php

declare(strict_types=1);

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Facades\Log;
use RuntimeException;

final class CieloFinanceService
{
    private Client $cieloClient;
    private Client $heliusClient;
    private string $cieloApiKey;
    private string $heliusApiKey;

    public function __construct()
    {
        $this->cieloApiKey = config('services.cielo.api_key', '506f1e48-fb12-4012-9533-f5d2d1f15f6d');
        $this->heliusApiKey = config('services.helius.api_key', 'c75a3429-f54c-419c-9b23-08e22c48f8e1');

        $this->cieloClient = new Client([
            'base_uri' => 'https://feed-api.cielo.finance',
            'timeout' => 30,
            'connect_timeout' => 8.0,
            'read_timeout' => 22.0,
            'http_errors' => false,
            'headers' => [
                'X-API-KEY' => $this->cieloApiKey,
                'accept' => 'application/json',
            ],
        ]);

        $this->heliusClient = new Client([
            'base_uri' => 'https://mainnet.helius-rpc.com',
            'timeout' => 30,
            'connect_timeout' => 8.0,
            'read_timeout' => 22.0,
            'http_errors' => false,
            'headers' => [
                'Content-Type' => 'application/json',
            ],
        ]);
    }

    public function getWalletBalance(string $walletAddress): ?float
    {
        $walletAddress = trim($walletAddress);
        if ($walletAddress === '') {
            throw new RuntimeException('Wallet address cannot be empty.');
        }

        try {
            $response = $this->heliusClient->request('POST', '/', [
                'query' => [
                    'api-key' => $this->heliusApiKey,
                ],
                'json' => [
                    'jsonrpc' => '2.0',
                    'id' => '1',
                    'method' => 'getBalance',
                    'params' => [
                        $walletAddress,
                    ],
                ],
            ]);

            $status = $response->getStatusCode();
            $body = (string) $response->getBody();

            if ($status < 200 || $status >= 300) {
                Log::warning('Helius balance API error', [
                    'wallet_address' => $walletAddress,
                    'status' => $status,
                    'body' => substr($body, 0, 200),
                ]);
                return null;
            }

            $data = json_decode($body, true, 512, JSON_THROW_ON_ERROR);
            $lamports = $data['result']['value'] ?? null;

            if (!is_numeric($lamports)) {
                return null;
            }

            return round(((float) $lamports) / 1_000_000_000, 9);
        } catch (GuzzleException $e) {
            Log::warning('Failed to fetch wallet balance via Helius', [
                'wallet_address' => $walletAddress,
                'error' => $e->getMessage(),
            ]);
            return null;
        } catch (\JsonException $e) {
            Log::warning('Failed to parse Helius balance response', [
                'wallet_address' => $walletAddress,
                'error' => $e->getMessage(),
            ]);
            return null;
        }
    }

    public function getWalletTokensPnL(string $walletAddress): array
    {
        $walletAddress = trim($walletAddress);
        if ($walletAddress === '') {
            throw new RuntimeException('Wallet address cannot be empty.');
        }

        $endpoint = "/api/v1/{$walletAddress}/pnl/tokens";
        $queryParams = ['chain' => 'solana'];

        try {
            $response = $this->cieloClient->request('GET', $endpoint, [
                'query' => $queryParams,
            ]);

            $status = $response->getStatusCode();
            $body = (string) $response->getBody();

            Log::info('Cielo PnL Tokens API response', [
                'wallet_address' => $walletAddress,
                'status' => $status,
                'body_preview' => substr($body, 0, 1000),
            ]);

            if ($status < 200 || $status >= 300) {
                throw new RuntimeException('Cielo Finance API error: HTTP ' . $status);
            }

            $data = json_decode($body, true, 512, JSON_THROW_ON_ERROR);

            $tokens = [];
            
            if (isset($data['data']['items']) && is_array($data['data']['items'])) {
                $tokens = $data['data']['items'];
            }
            elseif (isset($data['data']) && is_array($data['data'])) {
                $tokens = $data['data'];
            }
            elseif (isset($data['tokens']) && is_array($data['tokens'])) {
                $tokens = $data['tokens'];
            }
            elseif (is_array($data) && !isset($data['status']) && !isset($data['tokens'])) {
                $tokens = $data;
            }

            // Log first token structure for debugging
            if (!empty($tokens)) {
                Log::debug('Cielo PnL Tokens - first token structure', [
                    'wallet_address' => $walletAddress,
                    'tokens_count' => count($tokens),
                    'first_token_keys' => array_keys($tokens[0] ?? []),
                    'first_token_data' => $tokens[0] ?? null,
                ]);
            }

            return $tokens;

        } catch (GuzzleException $e) {
            throw new RuntimeException('Failed to fetch wallet tokens: ' . $e->getMessage());
        } catch (\JsonException $e) {
            throw new RuntimeException('Failed to parse API response: ' . $e->getMessage());
        }
    }

    public function getWalletTradingStats(string $walletAddress): array
    {
        return $this->getWalletTradingStatsWithRaw($walletAddress)['stats'];
    }

    public function getWalletTradingStatsWithRaw(string $walletAddress): array
    {
        $walletAddress = trim($walletAddress);
        if ($walletAddress === '') {
            throw new RuntimeException('Wallet address cannot be empty.');
        }

        $endpoint = "/api/v1/{$walletAddress}/trading-stats";
        $queryParams = ['days' => 'max'];

        try {
            $response = $this->cieloClient->request('GET', $endpoint, [
                'query' => $queryParams,
            ]);

            $status = $response->getStatusCode();
            $body = (string) $response->getBody();

            Log::info('Cielo Finance Trading Stats API response', [
                'wallet_address' => $walletAddress,
                'status' => $status,
                'body_preview' => substr($body, 0, 500),
            ]);

            if ($status < 200 || $status >= 300) {
                Log::error('Cielo Finance Trading Stats API error', [
                    'wallet_address' => $walletAddress,
                    'status' => $status,
                    'body' => $body,
                ]);
                throw new RuntimeException('Cielo Finance Trading Stats API error: HTTP ' . $status . ' - ' . substr($body, 0, 200));
            }

            $data = json_decode($body, true, 512, JSON_THROW_ON_ERROR);

            Log::debug('Cielo Finance Trading Stats parsed data', [
                'wallet_address' => $walletAddress,
                'data_structure' => array_keys($data),
            ]);

            if (isset($data['data']) && is_array($data['data'])) {
                $responseData = $data['data'];
            } elseif (is_array($data) && !isset($data['status'])) {
                $responseData = $data;
            } else {
                $responseData = $data;
            }

            Log::debug('Cielo Finance Trading Stats responseData', [
                'wallet_address' => $walletAddress,
                'response_data_keys' => array_keys($responseData),
            ]);

            $stats = [];

            $stats['pnl'] = $responseData['realized_pnl_usd']
                ?? $responseData['Realized PnL (USD)']
                ?? $responseData['pnl']
                ?? $responseData['total_pnl_usd']
                ?? 0;

            $stats['winrate'] = $responseData['win_rate']
                ?? $responseData['Win rate']
                ?? $responseData['winrate']
                ?? 0;

            $stats['swaps_count'] = $responseData['trades']
                ?? $responseData['Trades (swaps)']
                ?? $responseData['swaps_count']
                ?? $responseData['swaps']
                ?? 0;

            $stats['trades'] = $stats['swaps_count'];

            $stats['average_holding_time_sec'] = $responseData['avg_holding_time_sec']
                ?? $responseData['Avg holding time']
                ?? $responseData['average_holding_time_sec']
                ?? $responseData['avg_holding_time']
                ?? 0;

            $stats['consecutive_trading_days'] = $responseData['consecutive_active_days']
                ?? $responseData['Consecutive active days']
                ?? $responseData['consecutive_trading_days']
                ?? $responseData['consecutive_days']
                ?? 0;

            $stats['tokens_traded'] = $responseData['tokens_traded']
                ?? $responseData['Tokens traded']
                ?? $responseData['tokens']
                ?? 0;

            $stats['avg_pnl_per_trade'] = $responseData['avg_pnl_per_trade']
                ?? $responseData['Avg PnL per trade']
                ?? $responseData['average_pnl_per_trade']
                ?? 0;

            return [
                'stats' => $stats,
                'raw' => $data,
            ];

        } catch (GuzzleException $e) {
            throw new RuntimeException('Failed to fetch trading stats: ' . $e->getMessage());
        } catch (\JsonException $e) {
            throw new RuntimeException('Failed to parse trading stats response: ' . $e->getMessage());
        }
    }

    /**
     * Get full trading stats for dashboard (safe version - returns empty on error)
     */
    public function getFullTradingStats(string $walletAddress): array
    {
        $empty = $this->getEmptyStats();
        
        if (empty(trim($walletAddress))) {
            return $empty;
        }

        try {
            $response = $this->cieloClient->request('GET', "/api/v1/{$walletAddress}/trading-stats", [
                'query' => ['days' => 'max'],
            ]);

            $body = (string) $response->getBody();
            $data = json_decode($body, true, 512, JSON_THROW_ON_ERROR);

            if (isset($data['status']) && $data['status'] === 'pending') {
                return $empty;
            }

            $d = $data['data'] ?? $data;

            return [
                'pnl' => $d['pnl'] ?? 0,
                'winrate' => $d['winrate'] ?? 0,
                'swaps_count' => $d['swaps_count'] ?? 0,
                'buy_count' => $d['buy_count'] ?? 0,
                'sell_count' => $d['sell_count'] ?? 0,
                'total_buy_amount_usd' => $d['total_buy_amount_usd'] ?? 0,
                'total_sell_amount_usd' => $d['total_sell_amount_usd'] ?? 0,
                'average_buy_amount_usd' => $d['average_buy_amount_usd'] ?? 0,
                'average_sell_amount_usd' => $d['average_sell_amount_usd'] ?? 0,
                'average_holding_time_sec' => $d['average_holding_time_sec'] ?? 0,
                'consecutive_trading_days' => $d['consecutive_trading_days'] ?? 0,
                'roi_distribution' => $d['roi_distribution'] ?? $empty['roi_distribution'],
                'holding_distribution' => $d['holding_distribution'] ?? $empty['holding_distribution'],
            ];
        } catch (\Exception $e) {
            Log::warning('Failed to fetch full trading stats', ['error' => $e->getMessage()]);
            return $empty;
        }
    }

    /**
     * Get top tokens by PnL
     */
    public function getTopTokens(string $walletAddress, int $limit = 50): array
    {
        if (empty(trim($walletAddress))) {
            return [];
        }

        try {
            $tokens = $this->getWalletTokensPnL($walletAddress);
            
            // Normalize token data to match frontend expectations
            $normalizedTokens = array_map(fn($token) => $this->normalizeTokenData($token), $tokens);
            
            usort($normalizedTokens, fn($a, $b) => ($b['total_pnl_usd'] ?? 0) <=> ($a['total_pnl_usd'] ?? 0));
            return array_slice($normalizedTokens, 0, $limit);
        } catch (\Exception $e) {
            Log::warning('Failed to fetch top tokens', ['error' => $e->getMessage()]);
            return [];
        }
    }

    /**
     * Normalize token data from Cielo API to match frontend expectations
     * Handles both camelCase (API) and snake_case field names
     */
    private function normalizeTokenData(array $token): array
    {
        // Calculate buy/sell amounts from average prices and trade counts if direct values not available
        $avgBuyPrice = (float) ($token['average_buy_price'] ?? $token['averageBuyPrice'] ?? $token['avg_buy_price'] ?? 0);
        $avgSellPrice = (float) ($token['average_sell_price'] ?? $token['averageSellPrice'] ?? $token['avg_sell_price'] ?? 0);
        $totalVolume = (float) ($token['total_volume'] ?? $token['totalVolume'] ?? $token['volume'] ?? 0);
        
        // Direct buy/sell USD amounts - Cielo API uses `total_buy_usd` and `total_sell_usd`
        $buyAmountUsd = (float) ($token['total_buy_usd']  // Cielo API field
            ?? $token['total_buy_amount_usd'] 
            ?? $token['totalBuyAmountUsd']
            ?? $token['buy_amount_usd'] 
            ?? $token['buyAmountUsd']
            ?? $token['invested_amount'] 
            ?? $token['investedAmount']
            ?? $token['cost_basis']
            ?? $token['costBasis']
            ?? 0);
            
        $sellAmountUsd = (float) ($token['total_sell_usd']  // Cielo API field
            ?? $token['total_sell_amount_usd'] 
            ?? $token['totalSellAmountUsd']
            ?? $token['sell_amount_usd'] 
            ?? $token['sellAmountUsd']
            ?? $token['sold_amount']
            ?? $token['soldAmount']
            ?? $token['revenue']
            ?? 0);
        
        // Get PnL values (can help calculate buy/sell if not directly available)
        $realizedPnl = (float) ($token['realized_pnl'] ?? $token['realizedPnl'] ?? $token['realized_pnl_usd'] ?? 0);
        $unrealizedPnl = (float) ($token['unrealized_pnl'] ?? $token['unrealizedPnl'] ?? $token['unrealized_pnl_usd'] ?? 0);
        $totalPnl = (float) ($token['total_pnl'] ?? $token['totalPnl'] ?? $token['total_pnl_usd'] ?? $token['pnl'] ?? ($realizedPnl + $unrealizedPnl));
        
        // If buy/sell amounts are 0 but we have volume and prices, try to estimate
        if ($buyAmountUsd == 0 && $totalVolume > 0 && $avgBuyPrice > 0) {
            $buyAmountUsd = $totalVolume * $avgBuyPrice * 0.5; // rough estimate
        }
        if ($sellAmountUsd == 0 && $buyAmountUsd > 0 && $totalPnl != 0) {
            $sellAmountUsd = $buyAmountUsd + $realizedPnl; // sell = buy + realized profit
        }
        
        // Calculate ROI
        $roi = (float) ($token['roi_percentage'] ?? $token['roiPercentage'] ?? $token['roi'] ?? 0);
        if ($roi == 0 && $buyAmountUsd > 0) {
            $roi = ($totalPnl / $buyAmountUsd) * 100;
        }

        return [
            // Token identification - handle both camelCase and snake_case
            'token_address' => $token['token_address'] ?? $token['tokenAddress'] ?? $token['address'] ?? $token['mint'] ?? '',
            'token_symbol' => $token['token_symbol'] ?? $token['tokenSymbol'] ?? $token['symbol'] ?? '',
            'token_name' => $token['token_name'] ?? $token['tokenName'] ?? $token['name'] ?? '',
            
            // Token image - Cielo API doesn't provide image, use fallback CDN for Solana tokens
            'token_image_url' => $token['token_image_url'] 
                ?? $token['tokenImageUrl']
                ?? $token['image_url'] 
                ?? $token['imageUrl']
                ?? $token['image'] 
                ?? $token['logo_uri'] 
                ?? $token['logoUri']
                ?? $token['logo'] 
                ?? $token['icon']
                ?? $token['iconUrl']
                ?? $this->getTokenImageUrl($token['token_address'] ?? $token['tokenAddress'] ?? $token['address'] ?? null),
            
            // PnL data
            'total_pnl_usd' => $totalPnl,
            'realized_pnl_usd' => $realizedPnl,
            'unrealized_pnl_usd' => $unrealizedPnl,
            'roi_percentage' => $roi,
            
            // Buy/Sell amounts
            'total_buy_amount_usd' => $buyAmountUsd,
            'total_sell_amount_usd' => $sellAmountUsd,
            'average_buy_price' => $avgBuyPrice,
            'average_sell_price' => $avgSellPrice,
            
            // Trading stats
            'num_swaps' => (int) ($token['num_swaps'] 
                ?? $token['numSwaps']
                ?? $token['total_trades'] 
                ?? $token['totalTrades']
                ?? $token['trades'] 
                ?? $token['trade_count'] 
                ?? $token['tradeCount']
                ?? $token['swaps']
                ?? 0),
            'holding_time_seconds' => (int) ($token['holding_time_seconds'] 
                ?? $token['holdingTimeSeconds']
                ?? $token['avg_holding_time_sec'] 
                ?? $token['avgHoldingTimeSec']
                ?? $token['holding_time'] 
                ?? $token['holdingTime']
                ?? $token['avg_hold_time']
                ?? $token['avgHoldTime']
                ?? 0),
            
            // Holdings
            'holdings' => (float) ($token['holdings'] ?? $token['balance'] ?? $token['amount'] ?? 0),
            'holdings_value' => (float) ($token['holdings_value'] ?? $token['holdingsValue'] ?? $token['value'] ?? 0),
            'current_price' => (float) ($token['current_price'] ?? $token['currentPrice'] ?? $token['price'] ?? 0),
            
            // Market data
            'token_market_cap_usd' => (float) ($token['token_market_cap_usd'] 
                ?? $token['tokenMarketCapUsd']
                ?? $token['market_cap_usd'] 
                ?? $token['marketCapUsd']
                ?? $token['market_cap'] 
                ?? $token['marketCap']
                ?? $token['mcap']
                ?? 0),
            
            // Preserve chain info
            'chain' => $token['chain'] ?? 'solana',
        ];
    }

    /**
     * Get token image URL from known CDN sources for Solana tokens
     */
    private function getTokenImageUrl(?string $tokenAddress): ?string
    {
        if (empty($tokenAddress)) {
            return null;
        }
        
        // Use DexScreener CDN for token images (most reliable for Solana tokens)
        return "https://dd.dexscreener.com/ds-data/tokens/solana/{$tokenAddress}.png";
    }

    private function getEmptyStats(): array
    {
        return [
            'pnl' => 0, 'winrate' => 0, 'swaps_count' => 0, 'buy_count' => 0, 'sell_count' => 0,
            'total_buy_amount_usd' => 0, 'total_sell_amount_usd' => 0,
            'average_buy_amount_usd' => 0, 'average_sell_amount_usd' => 0,
            'average_holding_time_sec' => 0, 'consecutive_trading_days' => 0,
            'roi_distribution' => ['roi_above_500' => 0, 'roi_200_to_500' => 0, 'roi_50_to_200' => 0, 'roi_0_to_50' => 0, 'roi_neg50_to_0' => 0, 'roi_below_neg50' => 0],
            'holding_distribution' => ['hold_0_3_min' => 0, 'hold_3_20_min' => 0, 'hold_20_60_min' => 0, 'hold_1_6_hours' => 0, 'hold_6_24_hours' => 0, 'hold_gt_24_hours' => 0, 'total_tokens' => 0],
        ];
    }
}
