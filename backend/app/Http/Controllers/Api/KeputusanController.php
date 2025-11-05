<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Keputusan;
use App\Models\AiAnalisis;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class KeputusanController extends Controller
{
    public function getAnalisisTanpaKeputusan()
    {
        try {
            $analisis = AiAnalisis::with(['laporan.lokasi', 'laporan.user'])
                ->whereDoesntHave('keputusan')
                ->whereHas('laporan', function($query) {
                    $query->where('status', 'valid');
                })
                ->orderBy('tanggal_analisis', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'analyses' => $analisis
            ]);

        } catch (\Exception $e) {
            \Log::error('Get analisis tanpa keputusan error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat data analisis'
            ], 500);
        }
    }

    // Buat keputusan baru
    public function store(Request $request)
    {
        try {
            $request->validate([
                'analisis_id' => 'required|exists:ai_analisis,analisis_id',
                'tindakan_yang_diambil' => 'required|string|min:10',
                'anggaran' => 'nullable|numeric|min:0',
                'tanggal_mulai' => 'nullable|date',
                'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_mulai',
                'catatan' => 'nullable|string'
            ]);

            // Cek apakah sudah ada keputusan untuk analisis ini
            $existingKeputusan = Keputusan::where('analisis_id', $request->analisis_id)->first();
            if ($existingKeputusan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sudah ada keputusan untuk analisis ini'
                ], 400);
            }

            $keputusan = Keputusan::create([
                'analisis_id' => $request->analisis_id,
                'user_id' => Auth::id(),
                'status_keputusan' => 'direncanakan',
                'tindakan_yang_diambil' => $request->tindakan_yang_diambil,
                'anggaran' => $request->anggaran,
                'tanggal_mulai' => $request->tanggal_mulai,
                'tanggal_selesai' => $request->tanggal_selesai,
                'catatan' => $request->catatan
            ]);

            // Load relationships untuk response
            $keputusan->load(['analisis.laporan.lokasi', 'user']);

            return response()->json([
                'success' => true,
                'keputusan' => $keputusan,
                'message' => 'Keputusan berhasil dibuat'
            ]);

        } catch (\Exception $e) {
            \Log::error('Store keputusan error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat keputusan: ' . $e->getMessage()
            ], 500);
        }
    }

    // Update status keputusan
    public function updateStatus(Request $request, $id)
    {
        try {
            $request->validate([
                'status_keputusan' => 'required|in:direncanakan,disetujui,ditolak,selesai'
            ]);

            $keputusan = Keputusan::with(['analisis.laporan'])->find($id);
            
            if (!$keputusan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Keputusan tidak ditemukan'
                ], 404);
            }

            $keputusan->update([
                'status_keputusan' => $request->status_keputusan
            ]);

            return response()->json([
                'success' => true,
                'keputusan' => $keputusan,
                'message' => 'Status keputusan berhasil diupdate'
            ]);

        } catch (\Exception $e) {
            \Log::error('Update status keputusan error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal update status keputusan'
            ], 500);
        }
    }

    // Update keputusan (full update)
    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'tindakan_yang_diambil' => 'required|string|min:10',
                'anggaran' => 'nullable|numeric|min:0',
                'tanggal_mulai' => 'nullable|date',
                'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_mulai',
                'catatan' => 'nullable|string',
                'status_keputusan' => 'required|in:direncanakan,disetujui,ditolak,selesai'
            ]);

            $keputusan = Keputusan::find($id);
            
            if (!$keputusan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Keputusan tidak ditemukan'
                ], 404);
            }

            $keputusan->update([
                'tindakan_yang_diambil' => $request->tindakan_yang_diambil,
                'anggaran' => $request->anggaran,
                'tanggal_mulai' => $request->tanggal_mulai,
                'tanggal_selesai' => $request->tanggal_selesai,
                'catatan' => $request->catatan,
                'status_keputusan' => $request->status_keputusan
            ]);

            $keputusan->load(['analisis.laporan.lokasi', 'user']);

            return response()->json([
                'success' => true,
                'keputusan' => $keputusan,
                'message' => 'Keputusan berhasil diupdate'
            ]);

        } catch (\Exception $e) {
            \Log::error('Update keputusan error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal update keputusan: ' . $e->getMessage()
            ], 500);
        }
    }

    // Get semua keputusan
    public function getAllKeputusan()
    {
        try {
            $keputusan = Keputusan::with([
                'analisis.laporan.lokasi', 
                'analisis.laporan.user',
                'user'
            ])
            ->orderBy('created_at', 'desc')
            ->get();

            return response()->json([
                'success' => true,
                'keputusan' => $keputusan
            ]);

        } catch (\Exception $e) {
            \Log::error('Get all keputusan error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat data keputusan'
            ], 500);
        }
    }

    // Get keputusan by ID
    public function show($id)
    {
        try {
            $keputusan = Keputusan::with([
                'analisis.laporan.lokasi',
                'analisis.laporan.user',
                'user'
            ])->find($id);

            if (!$keputusan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Keputusan tidak ditemukan'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'keputusan' => $keputusan
            ]);

        } catch (\Exception $e) {
            \Log::error('Show keputusan error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat detail keputusan'
            ], 500);
        }
    }

    // Get keputusan by analisis_id
    public function getByAnalisis($analisisId)
    {
        try {
            $keputusan = Keputusan::with(['user', 'analisis.laporan'])
                ->where('analisis_id', $analisisId)
                ->first();

            if (!$keputusan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Belum ada keputusan untuk analisis ini'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'keputusan' => $keputusan
            ]);

        } catch (\Exception $e) {
            \Log::error('Get keputusan by analisis error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat keputusan'
            ], 500);
        }
    }

    // Delete keputusan
    public function destroy($id)
    {
        try {
            $keputusan = Keputusan::find($id);
            
            if (!$keputusan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Keputusan tidak ditemukan'
                ], 404);
            }

            $keputusan->delete();

            return response()->json([
                'success' => true,
                'message' => 'Keputusan berhasil dihapus'
            ]);

        } catch (\Exception $e) {
            \Log::error('Delete keputusan error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus keputusan'
            ], 500);
        }
    }
}