<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Laporan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class LaporanController extends Controller
{
    public function index()
    {
        // Hapus 'jenis' dari with()
        $laporan = Laporan::with(['user', 'lokasi'])->get();
        return response()->json($laporan);
    }

    public function show($id)
    {
        // Hapus 'jenis' dari with()
        $laporan = Laporan::with(['user', 'lokasi'])->findOrFail($id);
        return response()->json($laporan);
    }

    public function store(Request $request)
    {
        $request->validate([
            'lokasi_id' => 'required|exists:lokasis,lokasi_id',
            // Hapus validasi untuk 'jenis_id'
            'jenis_laporan' => 'required|string',
            'isi_laporan' => 'required|string',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $path = null;
        if ($request->hasFile('foto')) {
            $path = $request->file('foto')->store('laporan', 'public');
        }

        $laporan = Laporan::create([
            'user_id' => auth()->check() ? auth()->id() : null,
            'lokasi_id' => $request->lokasi_id,
            // Hapus 'jenis_id' dari data creation
            'jenis_laporan' => $request->jenis_laporan,
            'tanggal_laporan' => Carbon::now(),
            'isi_laporan' => $request->isi_laporan,
            'foto' => $path,
            'status' => 'pending',
        ]);

        return response()->json($laporan, 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,valid,ditolak',
        ]);

        $laporan = Laporan::findOrFail($id);
        $laporan->update(['status' => $request->status]);

        return response()->json($laporan);
    }

    public function destroy($id)
    {
        $laporan = Laporan::findOrFail($id);

        if ($laporan->foto && Storage::disk('public')->exists($laporan->foto)) {
            Storage::disk('public')->delete($laporan->foto);
        }

        $laporan->delete();

        return response()->json(['message' => 'Laporan berhasil dihapus']);
    }
}