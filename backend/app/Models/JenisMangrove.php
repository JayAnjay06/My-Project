<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JenisMangrove extends Model
{
    use HasFactory;

    protected $table = 'jenis_mangroves';
    protected $primaryKey = 'jenis_id';

    protected $fillable = [
        'nama_ilmiah',
        'nama_lokal',
        'deskripsi',
        'gambar'
    ];
}
