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
        Schema::create('lokasis', function (Blueprint $table) {
            $table->id('lokasi_id');
            $table->string('nama_lokasi');
            $table->string('koordinat');
            $table->integer('jumlah')->default(0);
            $table->float('kerapatan')->nullable();
            $table->float('tinggi_rata2')->nullable();
            $table->float('diameter_rata2')->nullable();
            $table->enum('kondisi', ['baik', 'sedang', 'buruk'])->default('baik');
            $table->float('luas_area')->nullable();
            $table->text('deskripsi')->nullable();
            $table->date('tanggal_input')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lokasis');
    }
};
