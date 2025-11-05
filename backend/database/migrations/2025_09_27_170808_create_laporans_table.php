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
        Schema::create('laporans', function (Blueprint $table) {
            $table->id('laporan_id');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('lokasi_id');
            $table->string('jenis_laporan');
            $table->dateTime('tanggal_laporan');
            $table->text('isi_laporan');
            $table->string('foto')->nullable();
            $table->enum('status', ['pending', 'valid', 'ditolak'])->default('pending');
            $table->timestamps();

            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('set null');
            $table->foreign('lokasi_id')->references('lokasi_id')->on('lokasis')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('laporans');
    }
};
