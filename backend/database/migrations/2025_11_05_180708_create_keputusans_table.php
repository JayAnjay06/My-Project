<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('keputusans', function (Blueprint $table) {
            $table->id('keputusan_id');
            $table->unsignedBigInteger('analisis_id');
            $table->unsignedBigInteger('user_id');
            $table->enum('status_keputusan', ['direncanakan', 'disetujui', 'ditolak', 'selesai'])->default('direncanakan');
            $table->text('tindakan_yang_diambil');
            $table->decimal('anggaran', 15, 2)->nullable();
            $table->date('tanggal_mulai')->nullable();
            $table->date('tanggal_selesai')->nullable();
            $table->text('catatan')->nullable();
            $table->timestamps();

            $table->foreign('analisis_id')
                  ->references('analisis_id')
                  ->on('ai_analisis')
                  ->onDelete('cascade');
                  
            $table->foreign('user_id')
                  ->references('user_id')
                  ->on('users')
                  ->onDelete('cascade');
                  
            $table->index(['analisis_id']);
            $table->index(['status_keputusan']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('keputusans');
    }
};