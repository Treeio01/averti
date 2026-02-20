<?php

declare(strict_types=1);

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Facades\Log;
use RuntimeException;

final class OpenAIService
{
    private Client $http;
    private string $apiKey;
    private string $model;

    public function __construct()
    {
        $this->apiKey = (string) config('services.openai.api_key', env('OPENAI_API_KEY', ''));
        $this->model = (string) (config('services.openai.model') ?? 'gpt-4o-mini');

        if ($this->apiKey === '') {
            throw new RuntimeException('OPENAI_API_KEY is not set.');
        }

        $this->http = new Client([
            'base_uri' => 'https://api.openai.com',
            'timeout' => 30,
            'connect_timeout' => 8.0,
            'read_timeout' => 22.0,
            'http_errors' => false,
            'headers' => [
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ],
        ]);
    }

    public function generateRiskInsight(array $traderData): string
    {
        Log::info('OpenAI: Generating borrowing risk insight', [
            'trader_data_keys' => array_keys($traderData),
        ]);

        $prompt = <<<PROMPT
You are Stavro AI, an analytical agent helping users understand the risks of borrowing based on their on-chain wallet behavior.
You receive a JSON dataset containing trading statistics such as PnL, win rate, swap activity, ROI distribution, average holding time, and other behavioral signals.

Your task is to:

Analyze the JSON data.

Provide the user with 2–3 short sentences describing:

how risky it may be for them personally to take a loan based on their behavior,
and what general recommendations they should consider before borrowing.

Important rules:

Do NOT output more than 3 sentences.
Do NOT give hard judgments like “approved”, “declined”, “you are safe”, “you will default”, etc.
Frame everything as risk awareness, not a credit decision.
You may comment on volatility, consistency, discipline, holding patterns, and overall behavioral trends.
Tone must be helpful, neutral, and human-like — not robotic.
Provide practical, simple recommendations (e.g., “consider reducing short-term trades”, “review your recent volatility”).
Speak directly to the user.

INPUT:
{{TRADER_JSON}}

OUTPUT:
2–3 natural sentences containing:

a soft assessment of their borrowing risk
simple recommendations based on their own behavior
Nothing else.
PROMPT;

        $traderJson = json_encode($traderData, JSON_PRETTY_PRINT);
        $fullPrompt = str_replace('{{TRADER_JSON}}', $traderJson, $prompt);

        Log::info('OpenAI: Sending prompt for risk insight', [
            'json_length' => strlen($traderJson),
        ]);

        $result = $this->makeRequest($fullPrompt, 'risk_insight');

        Log::info('OpenAI: Borrowing risk insight received', [
            'message_length' => strlen($result),
            'preview' => substr($result, 0, 200),
        ]);

        return $result;
    }

    private function makeRequest(string $prompt, string $type = 'request'): string
    {
        $endpoint = '/v1/chat/completions';

        $payload = [
            'model' => $this->model,
            'messages' => [
                ['role' => 'user', 'content' => $prompt],
            ],
            'temperature' => 0.3,
            'max_tokens' => 500,
        ];

        try {
            Log::info('OpenAI: Making request', [
                'type' => $type,
                'model' => $this->model,
                'endpoint' => $endpoint,
            ]);

            $response = $this->http->request('POST', $endpoint, [
                'json' => $payload,
            ]);

            $status = $response->getStatusCode();
            $body = (string) $response->getBody();

            Log::info('OpenAI: API response', [
                'type' => $type,
                'status' => $status,
                'response_length' => strlen($body),
            ]);

            if ($status < 200 || $status >= 300) {
                Log::error('OpenAI: API error', [
                    'type' => $type,
                    'status' => $status,
                    'response' => substr($body, 0, 500),
                ]);
                throw new RuntimeException('OpenAI API error: HTTP ' . $status . ' - ' . $body);
            }

            $data = json_decode($body, true, 512, JSON_THROW_ON_ERROR);

            if (!isset($data['choices'][0]['message']['content'])) {
                Log::error('OpenAI: Invalid response structure', [
                    'type' => $type,
                    'response_keys' => array_keys($data),
                ]);
                throw new RuntimeException('Invalid OpenAI API response structure');
            }

            $content = trim($data['choices'][0]['message']['content']);

            return $content;

        } catch (GuzzleException $e) {
            Log::error('OpenAI: Request failed', [
                'type' => $type,
                'error' => $e->getMessage(),
            ]);
            throw new RuntimeException('Failed to call OpenAI API: ' . $e->getMessage());
        } catch (\JsonException $e) {
            Log::error('OpenAI: JSON parse error', [
                'type' => $type,
                'error' => $e->getMessage(),
            ]);
            throw new RuntimeException('Failed to parse OpenAI API response: ' . $e->getMessage());
        }
    }
}

