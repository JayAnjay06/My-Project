<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JenisMangrove;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class JenisMangroveController extends Controller
{
    public function index()
    {
        return response()->json(JenisMangrove::all());
    }

    public function show($id)
    {
        $jenis = JenisMangrove::findOrFail($id);
        return response()->json($jenis);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_ilmiah' => 'required|string',
            'nama_lokal' => 'required|string',
            'deskripsi' => 'required|string',
            'gambar' => 'nullable|image|mimes:jpg,jpeg,png|max:2048'
        ]);

        $path = null;
        if ($request->hasFile('gambar')) {
            $path = $request->file('gambar')->store('jenis_mangrove', 'public');
        }

        $jenis = JenisMangrove::create([
            'nama_ilmiah' => $request->nama_ilmiah,
            'nama_lokal' => $request->nama_lokal,
            'deskripsi' => $request->deskripsi,
            'gambar' => $path
        ]);

        // balikin URL full
        $jenis->gambar = $path ? asset('storage/' . $path) : null;

        return response()->json($jenis, 201);
    }

    public function update(Request $request, $id)
    {
        $jenis = JenisMangrove::findOrFail($id);

        $data = $request->only(['nama_ilmiah', 'nama_lokal', 'deskripsi']);

        if ($request->hasFile('gambar')) {
            if ($jenis->gambar && Storage::disk('public')->exists($jenis->gambar)) {
                Storage::disk('public')->delete($jenis->gambar);
            }
            $path = $request->file('gambar')->store('jenis_mangrove', 'public');
            $data['gambar'] = $path;
        }

        $jenis->update($data);

        // balikin URL full
        $jenis->gambar = $jenis->gambar ? asset('storage/' . $jenis->gambar) : null;

        return response()->json($jenis);
    }

    public function destroy($id)
    {
        $jenis = JenisMangrove::findOrFail($id);

        if ($jenis->gambar && Storage::disk('public')->exists($jenis->gambar)) {
            Storage::disk('public')->delete($jenis->gambar);
        }

        $jenis->delete();

        return response()->json(['message' => 'Jenis Mangrove berhasil dihapus']);
    }
}
