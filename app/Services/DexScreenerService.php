<?php

declare(strict_types=1);

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Facades\Log;
use RuntimeException;

final class DexScreenerService
{
    private Client $http;

    public function __construct()
    {
        $this->http = new Client([
            'base_uri' => 'https://api.dexscreener.com',
            'timeout' => 30,
            'connect_timeout' => 8.0,
            'read_timeout' => 22.0,
            'http_errors' => false,
            'headers' => [
                'accept' => 'application/json',
            ],
        ]);
    }

    /**
     * Get token data from DexScreener API
     *
     * @param string $tokenAddress Token address (user wallet address)
     * @return array Token data from DexScreener
     * @throws RuntimeException
     */
    public function getTokenData(string $tokenAddress): array
    {
        Log::info('DexScreener: Fetching token data', [
            'token_address' => $tokenAddress,
        ]);

        try {
            $endpoint = '/latest/dex/tokens/' . $tokenAddress;

            $response = $this->http->request('GET', $endpoint);

            $status = $response->getStatusCode();
            $body = (string) $response->getBody();

            Log::info('DexScreener: API response', [
                'status' => $status,
                'response_length' => strlen($body),
            ]);

            if ($status < 200 || $status >= 300) {
                Log::error('DexScreener: API error', [
                    'status' => $status,
                    'response' => substr($body, 0, 500),
                ]);
                throw new RuntimeException('DexScreener API error: HTTP ' . $status);
            }

            $data = json_decode($body, true, 512, JSON_THROW_ON_ERROR);

            Log::info('DexScreener: Parsed response', [
                'response_keys' => array_keys($data),
                'has_pairs_key' => array_key_exists('pairs', $data),
                'pairs_type' => gettype($data['pairs'] ?? null),
                'pairs_count' => is_array($data['pairs'] ?? null) ? count($data['pairs']) : 0,
                'response_preview' => substr($body, 0, 500),
            ]);

            // Check if pairs key exists in response
            if (!array_key_exists('pairs', $data)) {
                Log::error('DexScreener: Missing pairs key in response', [
                    'response_keys' => array_keys($data),
                    'full_response' => $data,
                ]);
                throw new RuntimeException('Invalid DexScreener API response structure: missing pairs');
            }

            // If pairs is null, convert to empty array (this is valid response from DexScreener)
            if ($data['pairs'] === null) {
                Log::info('DexScreener: Pairs is null, converting to empty array', [
                    'token_address' => $tokenAddress,
                ]);
                $data['pairs'] = [];
            }

            // Check if pairs is an array
            if (!is_array($data['pairs'])) {
                Log::error('DexScreener: Pairs is not an array', [
                    'pairs_type' => gettype($data['pairs']),
                    'pairs_value' => $data['pairs'],
                ]);
                throw new RuntimeException('Invalid DexScreener API response structure: pairs is not an array');
            }

            Log::info('DexScreener: Token data received', [
                'pairs_count' => count($data['pairs']),
            ]);

            return $data;

        } catch (GuzzleException $e) {
            Log::error('DexScreener: Request failed', [
                'error' => $e->getMessage(),
            ]);
            throw new RuntimeException('Failed to call DexScreener API: ' . $e->getMessage());
        } catch (\JsonException $e) {
            Log::error('DexScreener: JSON parse error', [
                'error' => $e->getMessage(),
            ]);
            throw new RuntimeException('Failed to parse DexScreener API response: ' . $e->getMessage());
        }
    }
}

