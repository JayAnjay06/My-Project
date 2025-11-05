<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lokasi;
use Illuminate\Http\Request;

class LokasiController extends Controller
{
    public function index()
    {
        return response()->json(Lokasi::all(), 200);
    }

    public function show($id)
    {
        $lokasi = Lokasi::find($id);
        if (!$lokasi) {
            return response()->json(['message' => 'Lokasi tidak ditemukan'], 404);
        }
        return response()->json($lokasi, 200);
    }

    public function store(Request $request)
    {
        if ($request->user()->role !== 'peneliti') {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        $validated = $request->validate([
            'nama_lokasi' => 'required|string',
            'koordinat' => 'required|string',
            'jumlah' => 'nullable|integer',
            'kerapatan' => 'nullable|numeric',
            'tinggi_rata2' => 'nullable|numeric',
            'diameter_rata2' => 'nullable|numeric',
            'kondisi' => 'nullable|in:baik,sedang,buruk',
            'luas_area' => 'nullable|numeric',
            'deskripsi' => 'nullable|string',
            'tanggal_input' => 'nullable|date',
        ]);

        $lokasi = Lokasi::create($validated);
        return response()->json($lokasi, 201);
    }

    public function update(Request $request, $id)
    {
        if ($request->user()->role !== 'peneliti') {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        $lokasi = Lokasi::find($id);
        if (!$lokasi) {
            return response()->json(['message' => 'Lokasi tidak ditemukan'], 404);
        }

        $lokasi->update($request->all());
        return response()->json($lokasi, 200);
    }

    public function destroy(Request $request, $id)
    {
        if ($request->user()->role !== 'peneliti') {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        $lokasi = Lokasi::find($id);
        if (!$lokasi) {
            return response()->json(['message' => 'Lokasi tidak ditemukan'], 404);
        }

        $lokasi->delete();
        return response()->json(['message' => 'Lokasi berhasil dihapus'], 200);
    }
}
