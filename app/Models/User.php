<?php
namespace App\Models;

use Filament\Models\Contracts\FilamentUser;
use Filament\Models\Contracts\HasName;
use Filament\Panel;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\HasMany;
class User extends Authenticatable implements FilamentUser, HasName
{
    protected $fillable = [
        'email',
        'password',
        'address',
        'is_admin',
       
    ];

    protected $hidden = ['password'];

    protected $casts = [
        'is_admin' => 'boolean',
        'password' => 'hashed', // Laravel 10/11 автоматом хэшит при set
      
    ];
    

    public function canAccessPanel(Panel $panel): bool
    {
        return $this->is_admin === true;
    }

    // как Filament будет отображать имя пользователя в UI
    public function getFilamentName(): string
    {
        return $this->email ?? $this->address ?? 'User';
    }
}
