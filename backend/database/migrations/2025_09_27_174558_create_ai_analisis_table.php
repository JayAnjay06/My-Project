<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_analisis', function (Blueprint $table) {
            $table->id('analisis_id');
            $table->unsignedBigInteger('laporan_id');
            $table->text('hasil_kondisi')->nullable();
            $table->float('confidence', 3, 2)->nullable();
            $table->enum('kondisi', ['sehat', 'rusak_ringan', 'rusak_berat', 'mati'])->nullable();
            $table->enum('penyebab_kerusakan', ['sampah', 'limbah', 'erosi', 'ikan_pemakan', 'alam', 'lainnya'])->nullable();
            $table->text('rekomendasi_penanganan')->nullable();
            $table->enum('urgensi', ['rendah', 'sedang', 'tinggi', 'kritis'])->nullable();
            $table->dateTime('tanggal_analisis');
            $table->timestamps();

            $table->foreign('laporan_id')
                  ->references('laporan_id')
                  ->on('laporans')
                  ->onDelete('cascade');
                  
            $table->index(['laporan_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_analisis');
    }
};