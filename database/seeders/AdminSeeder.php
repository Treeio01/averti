<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $email = env('ADMIN_EMAIL', 'admin@example.com');
        $password = env('ADMIN_PASSWORD');

        if (!$password) {
            throw new \RuntimeException('ADMIN_PASSWORD не задан в .env');
        }

        $user = User::updateOrCreate(
            ['email' => $email],
            [
                'email' => $email,
                'password' => Hash::make($password),
            ]
        );

        if (!$user->is_admin) {
            $user->forceFill(['is_admin' => true])->save();
        }
        $user->save();
    }

}
