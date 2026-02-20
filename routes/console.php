<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Models\User;

Artisan::command("make-admin", function($id){
    $user = User::find($id);
    $user->is_admin = true;
    $user->save();


});
