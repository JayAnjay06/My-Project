<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $primaryKey = 'user_id';

    protected $fillable = [
        'username',
        'password',
        'nama_lengkap',
        'email',
        'role'
    ];

    protected $hidden = [
        'password',
    ];
}
