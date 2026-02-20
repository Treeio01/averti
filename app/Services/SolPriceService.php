<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class SolPriceService
{
    private const BASE_URL = 'https://api.binance.com/api/v3';
    private const SYMBOL = 'SOLUSDT';
    private const HTTP_TIMEOUT = 3;

    public function getKlines(string $interval = '1m', int $limit = 60): array
    {
        $cacheKey = "sol:klines:{$interval}:{$limit}";
        $ttl = $interval === '1m' ? 5 : 15;

        return Cache::remember($cacheKey, $ttl, function () use ($interval, $limit) {
            $response = Http::timeout(self::HTTP_TIMEOUT)
                ->get(self::BASE_URL . '/klines', [
                    'symbol' => self::SYMBOL,
                    'interval' => $interval,
                    'limit' => $limit,
                ]);

            $response->throw();

            return array_map(fn(array $k) => [
                't' => (int) $k[0],
                'p' => round((float) $k[4], 2),
            ], $response->json());
        });
    }

    public function getChart(string $timeframe = '24H'): array
    {
        [$interval, $limit] = match ($timeframe) {
            'Time' => ['1m', 30],
            '1H' => ['1m', 60],
            default => ['5m', 288],
        };

        $klines = $this->getKlines($interval, $limit);
        $price = !empty($klines) ? end($klines)['p'] : 0;

        return [
            'klines' => $klines,
            'price' => $price,
        ];
    }
}
