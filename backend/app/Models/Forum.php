<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Forum extends Model
{
    protected $table = 'forums';
    protected $primaryKey = 'forum_id';

    protected $fillable = [
        'user_id',
        'guest_name',
        'isi_pesan',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
