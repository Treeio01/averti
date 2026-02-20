<?php

declare(strict_types=1);

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Log;
use RuntimeException;

final class GrokService
{
    private Client $http;
    private string $apiKey;
    private string $model;
    private bool $debug;

    public function __construct()
    {
        $cfg = config('services.grok');

        $this->apiKey = (string) ($cfg['api_key'] ?? '');
        $this->model  = (string) ($cfg['model']   ?? 'grok-4-0709');
        $this->debug  = (bool)   ($cfg['debug']   ?? false);

        if ($this->apiKey === '') {
            throw new RuntimeException('GROK_API_KEY is not set.');
        }

        $baseUri = (string) ($cfg['base_uri'] ?? 'https://api.x.ai');
        $proxy   = (string) (env('GROK_HTTP_PROXY', '') ?: '');

        // Явно устанавливаем таймауты, игнорируя конфиг если там меньше
        $timeout = max((int) ($cfg['timeout'] ?? 60), 90); // минимум 90 секунд
        $readTimeout = max((float) ($cfg['read_timeout'] ?? 50.0), 80.0); // минимум 80 секунд
        
        $clientOptions = [
            'base_uri'        => $baseUri,
            'timeout'         => $timeout,   // увеличенный таймаут для Grok
            'connect_timeout' => 15.0,       // соединение - увеличено
            'read_timeout'    => $readTimeout, // чтение - увеличен для долгих ответов
            'http_errors'     => false,
            'headers' => [
                'Authorization' => 'Bearer '.$this->apiKey,
                'Content-Type'  => 'application/json',
                'User-Agent'    => 'GuzzleHttp/7',
            ],
            // иногда решает таймауты из-за IPv6
            'curl' => defined('CURL_IPRESOLVE_V4') ? [CURLOPT_IPRESOLVE => CURL_IPRESOLVE_V4] : [],
        ];
        
        Log::info('GrokService: HTTP client configured', [
            'timeout' => $timeout,
            'connect_timeout' => 15.0,
            'read_timeout' => $readTimeout,
            'base_uri' => $baseUri,
        ]);

        if ($proxy !== '') {
            $clientOptions['proxy'] = $proxy;
        }

        $this->http = new Client($clientOptions);

    }

    public function askTaxAdvisor(string $country, array $tradingData, string $userMessage = ''): string
    {
        $startTime = microtime(true);
        
        Log::info('GrokService: Starting tax advisor request', [
            'country' => $country,
            'trading_data_keys' => array_keys($tradingData),
            'trading_data' => $tradingData,
            'user_message_length' => strlen($userMessage),
            'model' => $this->model,
        ]);

        try {
            $systemPrompt = $this->buildTaxAdvisorPrompt($country, $tradingData);
            
            Log::debug('GrokService: System prompt built', [
                'prompt_length' => strlen($systemPrompt),
                'prompt_preview' => substr($systemPrompt, 0, 200) . '...',
            ]);
            
            $endpoint = '/v1/chat/completions';
            $method   = 'POST';

            $messages = [
                ['role' => 'system', 'content' => $systemPrompt],
            ];

            if ($userMessage !== '') {
                $messages[] = ['role' => 'user', 'content' => $userMessage];
            }

            $payload = [
                'model'    => $this->model,
                'messages' => $messages,
                'temperature' => 0.3,
                'max_tokens'  => 1500,
            ];

            Log::info('GrokService: Sending request to Grok API', [
                'endpoint' => $endpoint,
                'method' => $method,
                'model' => $this->model,
                'messages_count' => count($messages),
                'payload_size' => strlen(json_encode($payload)),
            ]);

            $response = $this->sendRequest($endpoint, $method, $payload);
            
            $duration = microtime(true) - $startTime;
            
            Log::info('GrokService: Tax advisor request completed', [
                'country' => $country,
                'response_length' => strlen($response),
                'duration_seconds' => round($duration, 2),
                'response_preview' => substr($response, 0, 200) . '...',
            ]);

            return $response;
        } catch (\Exception $e) {
            $duration = microtime(true) - $startTime;
            
            Log::error('GrokService: Tax advisor request failed', [
                'country' => $country,
                'error' => $e->getMessage(),
                'error_class' => get_class($e),
                'duration_seconds' => round($duration, 2),
                'trace' => $e->getTraceAsString(),
            ]);
            
            throw $e;
        }
    }

    private function buildTaxAdvisorPrompt(string $country, array $tradingData): string
    {
        $dataString = json_encode($tradingData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

        return <<<PROMPT
You are Luven AI Tax Advisor.

You receive two input parameters: the user's activity statistics and their country of residence.

YOUR PRIMARY TASK:
— INDEPENDENTLY AND ACCURATELY CALCULATE the exact amount of tax the user must pay.
— ALWAYS provide a clear final result: "Your tax = XXX".
— DO NOT use words like "approximately", "likely", "roughly", or any uncertain language.

STRICT WARNING:
YOU MUST NEVER SAY phrases such as:
"as a simulation",
"in a simulation",
"this is not real consultation".
THIS IS STRICTLY FORBIDDEN.
You always respond confidently, directly, and professionally — as a real tax specialist.

YOU MUST PERFORM THE CALCULATION EVEN IF THE DATA IS INCOMPLETE.
In that case, you calculate the tax based on whatever data is available.
You are NOT allowed to refuse or avoid the calculation.

YOU MUST:

1) Determine which tax categories apply in the user's country:
   — capital gains,
   — income tax,
   — taxes on trading, swapping, staking, farming,
   — short-term/long-term rules,
   — exemptions, thresholds, deductions.

2) Use the provided user statistics:
   — pnl,
   — buy/sell volumes,
   — number of trades,
   — average holding time,
   — ROI distribution,
   — trading activity.

3) Based on the country's tax laws:
   — determine the taxable base,
   — apply the correct tax rate,
   — calculate the final tax amount.

4) Provide the user with:
   — A CLEAR final result: "Your tax = XXX (local currency)",
   — A detailed breakdown of the calculation,
   — Filing deadlines,
   — Required forms and documents,
   — Recommendations for legally reducing taxes in the future.

STYLE:
— Write confidently and professionally, like a real crypto tax advisor.
— No refusals. No mentions of being a model or having limitations.
— ALWAYS output an exact tax amount.

DATA:
{$dataString}

COUNTRY:
{$country}
PROMPT;
    }


    private function sendRequest(string $endpoint, string $method, array $payload): string
    {
        $requestStartTime = microtime(true);
        $attempts = 0;
        $maxAttempts = 3;
        $lastException = null;
        $effectiveUri = null;
        $transferTime = null;
        $responseHeaders = [];
        $baseUri = (string) $this->http->getConfig('base_uri');

        Log::info('GrokService: Starting HTTP request', [
            'endpoint' => $endpoint,
            'method' => $method,
            'base_uri' => $baseUri,
            'full_url' => $baseUri . $endpoint,
            'max_attempts' => $maxAttempts,
            'timeout' => $this->http->getConfig('timeout'),
            'connect_timeout' => $this->http->getConfig('connect_timeout'),
            'read_timeout' => $this->http->getConfig('read_timeout'),
        ]);

        while ($attempts < $maxAttempts) {
            $attempts++;
            $attemptStartTime = microtime(true);

            Log::info('GrokService: Attempt started', [
                'attempt' => $attempts,
                'max_attempts' => $maxAttempts,
                'endpoint' => $endpoint,
            ]);

            try {
                $requestOptions = [
                    'json' => $payload,
                    'on_stats' => static function (\GuzzleHttp\TransferStats $stats) use (&$effectiveUri, &$transferTime): void {
                        $effectiveUri = (string) $stats->getEffectiveUri();
                        $transferTime = $stats->getTransferTime();
                    },
                ];

                Log::debug('GrokService: Sending HTTP request', [
                    'attempt' => $attempts,
                    'endpoint' => $endpoint,
                    'payload_size' => strlen(json_encode($payload)),
                    'payload_preview' => $this->truncate(json_encode($payload), 500),
                ]);

                $response = $this->http->request($method, $endpoint, $requestOptions);

                $attemptDuration = microtime(true) - $attemptStartTime;
                $status = $response->getStatusCode();
                $body = (string) $response->getBody();
                $responseHeaders = $this->headersToArray($response->getHeaders());

                Log::info('GrokService: HTTP response received', [
                    'attempt' => $attempts,
                    'status' => $status,
                    'effective_uri' => $effectiveUri,
                    'transfer_time' => $transferTime,
                    'attempt_duration' => round($attemptDuration, 3),
                    'body_length' => strlen($body),
                    'response_headers' => $responseHeaders,
                ]);

                if ($status === 404) {
                    Log::warning('GrokService: 404 Not Found', [
                        'attempt' => $attempts,
                        'effective_uri' => $effectiveUri,
                        'base_uri' => $baseUri,
                        'endpoint' => $endpoint,
                        'response_body' => $this->truncate($body, 1000),
                    ]);
                }

                if ($status < 200 || $status >= 300) {
                    Log::warning('GrokService: HTTP error status', [
                        'attempt' => $attempts,
                        'status' => $status,
                        'response_body' => $this->truncate($body, 1000),
                        'will_retry' => in_array($status, [429, 500, 502, 503, 504], true) && $attempts < $maxAttempts,
                    ]);

                    // Для 429/5xx попробуем ретрай
                    if (in_array($status, [429, 500, 502, 503, 504], true) && $attempts < $maxAttempts) {
                        $backoffDelay = (int) (100000 * (2 ** ($attempts - 1)));
                        Log::info('GrokService: Retrying after backoff', [
                            'attempt' => $attempts,
                            'next_attempt' => $attempts + 1,
                            'backoff_delay_ms' => $backoffDelay / 1000,
                        ]);
                        usleep($backoffDelay);
                        continue;
                    }
                    
                    throw new RuntimeException('Ошибка GROK API: ' . ($body ?: ('HTTP ' . $status)));
                }

                Log::debug('GrokService: Parsing response', [
                    'attempt' => $attempts,
                    'body_preview' => $this->truncate($body, 500),
                ]);

                $data = json_decode($body, true, 512, JSON_THROW_ON_ERROR);
                $content = $data['choices'][0]['message']['content'] ?? null;
                
                if (is_string($content) && $content !== '') {
                    $totalDuration = microtime(true) - $requestStartTime;
                    Log::info('GrokService: Request successful', [
                        'attempt' => $attempts,
                        'content_length' => strlen($content),
                        'total_duration' => round($totalDuration, 3),
                        'content_preview' => substr($content, 0, 200) . '...',
                    ]);
                    return $content;
                }

                Log::warning('GrokService: Unexpected response structure', [
                    'attempt' => $attempts,
                    'response_data' => $this->truncate(json_encode($data), 1000),
                ]);

                // вернём сырой JSON, если структура неожиданная
                return json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

            } catch (GuzzleException $e) {
                $lastException = $e;
                $attemptDuration = microtime(true) - $attemptStartTime;

                $isTimeout = strpos($e->getMessage(), 'timeout') !== false || 
                             strpos($e->getMessage(), 'timed out') !== false ||
                             $e->getCode() === 28; // CURLE_OPERATION_TIMEDOUT

                Log::error('GrokService: HTTP exception', [
                    'attempt' => $attempts,
                    'max_attempts' => $maxAttempts,
                    'exception_class' => get_class($e),
                    'exception_message' => $e->getMessage(),
                    'exception_code' => $e->getCode(),
                    'is_timeout' => $isTimeout,
                    'effective_uri' => $effectiveUri,
                    'base_uri' => $baseUri,
                    'endpoint' => $endpoint,
                    'transfer_time' => $transferTime,
                    'attempt_duration' => round($attemptDuration, 3),
                    'response_body' => $this->tryGetResponseBody($e),
                    'will_retry' => $attempts < $maxAttempts,
                ]);

                // ретраим на сетевых ошибках
                if ($attempts < $maxAttempts) {
                    $backoffDelay = (int) (150000 * (2 ** ($attempts - 1)));
                    Log::info('GrokService: Retrying after exception backoff', [
                        'attempt' => $attempts,
                        'next_attempt' => $attempts + 1,
                        'backoff_delay_ms' => $backoffDelay / 1000,
                    ]);
                    usleep($backoffDelay);
                    continue;
                }
            } catch (\Exception $e) {
                $attemptDuration = microtime(true) - $attemptStartTime;
                $lastException = $e;
                
                Log::error('GrokService: Unexpected exception', [
                    'attempt' => $attempts,
                    'exception_class' => get_class($e),
                    'exception_message' => $e->getMessage(),
                    'exception_code' => $e->getCode(),
                    'attempt_duration' => round($attemptDuration, 3),
                    'trace' => $e->getTraceAsString(),
                ]);
                
                if ($attempts < $maxAttempts) {
                    $backoffDelay = (int) (150000 * (2 ** ($attempts - 1)));
                    usleep($backoffDelay);
                    continue;
                }
            }
        }

        $totalDuration = microtime(true) - $requestStartTime;
        
        Log::error('GrokService: All attempts exhausted', [
            'total_attempts' => $attempts,
            'total_duration' => round($totalDuration, 3),
            'last_exception' => $lastException?->getMessage(),
            'last_exception_class' => $lastException ? get_class($lastException) : null,
        ]);

        // если дошли сюда — все попытки исчерпаны
        throw new RuntimeException('Ошибка GROK API: ' . ($lastException?->getMessage() ?? 'unknown'));
    }

    private function maskedHeaders(array $headers): array
    {
        if (isset($headers['Authorization'])) {
            $headers['Authorization'] = preg_replace('/^(Bearer\s+).+$/i', '$1************xxxx', $headers['Authorization']);
        }
        return $headers;
    }

    private function headersToArray(array $headers): array
    {
        $out = [];
        foreach ($headers as $k => $vals) {
            $out[$k] = implode(', ', (array) $vals);
        }
        return $out;
    }

    private function truncate(string $s, int $max = 4000): string
    {
        return strlen($s) > $max ? (substr($s, 0, $max) . '…[truncated]') : $s;
    }

    private function tryGetResponseBody(\Throwable $e): ?string
    {
        if ($e instanceof RequestException && $e->hasResponse()) {
            $response = $e->getResponse();
            if ($response !== null) {
                return (string) $response->getBody();
            }
        }
        return null;
    }
}
