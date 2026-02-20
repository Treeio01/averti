<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AnalyzeWalletRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'wallet_address' => ['required', 'string', 'min:32', 'max:44'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'wallet_address.required' => 'Wallet address is required.',
            'wallet_address.string' => 'Wallet address must be a string.',
            'wallet_address.min' => 'Wallet address is too short.',
            'wallet_address.max' => 'Wallet address is too long.',
        ];
    }
}

