<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Keputusan extends Model
{
    use HasFactory;

    protected $table = 'keputusans';
    protected $primaryKey = 'keputusan_id';

    protected $fillable = [
        'analisis_id',
        'user_id',
        'status_keputusan',
        'tindakan_yang_diambil',
        'anggaran',
        'tanggal_mulai',
        'tanggal_selesai',
        'catatan'
    ];

    protected $casts = [
        'anggaran' => 'decimal:2',
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date'
    ];

    // Relationship dengan AiAnalisis
    public function analisis()
    {
        return $this->belongsTo(AiAnalisis::class, 'analisis_id', 'analisis_id');
    }

    // Relationship dengan User (pemerintah yang memutuskan)
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    // Accessor untuk format anggaran
    public function getAnggaranFormattedAttribute()
    {
        return $this->anggaran ? 'Rp ' . number_format($this->anggaran, 0, ',', '.') : null;
    }

    // Scope untuk status tertentu
    public function scopeStatus($query, $status)
    {
        return $query->where('status_keputusan', $status);
    }
}