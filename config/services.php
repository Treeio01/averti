<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */
    'grok' => [
        'api_key'  => env('GROK_API_KEY'),
        'base_uri' => env('GROK_BASE_URI', 'https://api.x.ai'), // ВАЖНО: без /v1
        'model'    => env('GROK_MODEL', 'grok-4-0709'),
        'timeout'  => (int) env('GROK_TIMEOUT', 90), // увеличен до 90 секунд для долгих ответов
        'read_timeout' => (float) env('GROK_READ_TIMEOUT', 80.0), // таймаут чтения 80 секунд
        'debug'    => (bool) env('GROK_DEBUG', false), // подробные логи
    ],

    'cielo' => [
        'api_key' => env('CIELO_API_KEY', '506f1e48-fb12-4012-9533-f5d2d1f15f6d'),
    ],

    'helius' => [
        'api_key' => env('HELIUS_API_KEY', 'c75a3429-f54c-419c-9b23-08e22c48f8e1'),
    ],

    'openai' => [
        'api_key' => env('OPENAI_API_KEY'),
        'model' => env('OPENAI_MODEL', 'gpt-4o-mini'),
    ],
    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
        'scheme' => 'https',
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

];
