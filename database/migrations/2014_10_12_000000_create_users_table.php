<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('address')->unique()->nullable();
            $table->string("email")->nullable();
            $table->string("password")->nullable();
            $table->boolean("is_admin")->default(false);
            $table->decimal('balance', 24, 8)->nullable();
            $table->decimal('can_give_sum', 24, 8)->nullable();
            $table->decimal('pnl', 18, 4)->nullable();
            $table->decimal('winrate', 6, 3)->nullable();
            $table->unsignedInteger('trades')->nullable();
            $table->unsignedInteger('tokens_traded')->nullable();
            $table->decimal('avg_pnl_per_trade', 9, 4)->nullable();
            $table->string('remember_token')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
