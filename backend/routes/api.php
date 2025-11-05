<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
 
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

use App\Http\Controllers\Api\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);
});


use App\Http\Controllers\Api\LokasiController;

Route::get('/lokasi', [LokasiController::class, 'index']);
Route::get('/lokasi/{id}', [LokasiController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/lokasi', [LokasiController::class, 'store']);
    Route::put('/lokasi/{id}', [LokasiController::class, 'update']);
    Route::delete('/lokasi/{id}', [LokasiController::class, 'destroy']);
});

use App\Http\Controllers\Api\JenisMangroveController;

Route::get('/jenis', [JenisMangroveController::class, 'index']);
Route::get('/jenis/{id}', [JenisMangroveController::class, 'show']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/jenis', [JenisMangroveController::class, 'store']);
    Route::put('/jenis/{id}', [JenisMangroveController::class, 'update']);
    Route::delete('/jenis/{id}', [JenisMangroveController::class, 'destroy']);
});

use App\Http\Controllers\Api\LaporanController;

Route::get('/laporan', [LaporanController::class, 'index']);
Route::get('/laporan/{id}', [LaporanController::class, 'show']);
Route::post('/laporan', [LaporanController::class, 'store']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/laporan-valid', [LaporanController::class, 'getValid']);
    Route::put('/laporan/{id}/status', [LaporanController::class, 'updateStatus']);
    Route::delete('/laporan/{id}', [LaporanController::class, 'destroy']);
});

use App\Http\Controllers\Api\AiChatController;

Route::get('/chat', [AiChatController::class, 'index']);
Route::post('/chat', [AiChatController::class, 'store']);
 
use App\Http\Controllers\Api\ForumController;

Route::get('/forum', [ForumController::class, 'index']);
Route::post('/forum', [ForumController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/forum', [ForumController::class, 'store']);
    Route::delete('/forum/{id}', [ForumController::class, 'destroy']);
});

use App\Http\Controllers\Api\AiAnalisisController;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/laporan/{id}/analyze', [AiAnalisisController::class, 'analyzeLaporan']);
    Route::get('/laporan/{id}/analysis', [AiAnalisisController::class, 'getAnalysis']);
    Route::get('/analyses', [AiAnalisisController::class, 'getAllAnalysis']);
    Route::delete('/analysis/{id}', [AiAnalisisController::class, 'deleteAnalysis']);
});

use App\Http\Controllers\Api\KeputusanController;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/analisis/{id}/keputusan', [KeputusanController::class, 'getByAnalisis']);
    Route::get('/keputusan/{id}', [KeputusanController::class, 'show']);
    Route::get('/analisis-tanpa-keputusan', [KeputusanController::class, 'getAnalisisTanpaKeputusan']);
    Route::post('/keputusan', [KeputusanController::class, 'store']);
    Route::put('/keputusan/{id}/status', [KeputusanController::class, 'updateStatus']);
    Route::put('/keputusan/{id}', [KeputusanController::class, 'update']);
    Route::delete('/keputusan/{id}', [KeputusanController::class, 'destroy']);
    Route::get('/keputusan', [KeputusanController::class, 'getAllKeputusan']);
});