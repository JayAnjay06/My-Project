<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AiAnalisis extends Model
{
    use HasFactory;

    protected $table = 'ai_analisis';
    protected $primaryKey = 'analisis_id';

    protected $fillable = [
        'laporan_id',
        'hasil_kondisi',
        'confidence',
        'kondisi',
        'penyebab_kerusakan',
        'rekomendasi_penanganan',
        'urgensi',
        'tanggal_analisis'
    ];

    protected $casts = [
        'confidence' => 'float',
        'tanggal_analisis' => 'datetime'
    ];

    public function laporan()
    {
        return $this->belongsTo(Laporan::class, 'laporan_id', 'laporan_id');
    }
}