<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SolPriceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SolPriceController extends Controller
{
    public function __construct(
        private readonly SolPriceService $solPrice
    ) {}

    public function chart(Request $request): JsonResponse
    {
        $tf = $request->query('tf', '24H');

        if (!in_array($tf, ['Time', '1H', '24H'], true)) {
            $tf = '24H';
        }

        return response()->json($this->solPrice->getChart($tf));
    }
}
