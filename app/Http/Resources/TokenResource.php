<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TokenResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $totalPnlUsd = (float) ($this->resource['total_pnl_usd'] ?? 0);
        $roiPercentage = (float) ($this->resource['roi_percentage'] ?? 0);
        
        $amountSign = $totalPnlUsd >= 0 ? '+' : '';
        $formattedAmount = $amountSign . '$' . number_format(abs($totalPnlUsd), 2, '.', ',');

        $roiSign = $roiPercentage >= 0 ? '+' : '';
        $formattedRoi = $roiSign . number_format($roiPercentage, 2, '.', '') . ' % ROI';

        $avatar = $this->resource['image'] ?? '/img/avatar.png';

        return [
            'name' => $this->resource['token_name'] ?? 'Unknown Token',
            'roi' => $formattedRoi,
            'amount' => $formattedAmount,
            'avatar' => $avatar,
            'token_address' => $this->resource['token_address'] ?? null,
        ];
    }
}
