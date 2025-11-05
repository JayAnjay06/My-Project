<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Forum;

class ForumController extends Controller
{
    // Ambil semua pesan forum
    public function index()
    {
        $data = Forum::with('user')
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($data);
    }

    // Buat pesan forum (bisa guest atau user login)
    public function store(Request $request)
    {
        $request->validate([
            'isi_pesan' => 'required|string',
            'guest_name' => 'nullable|string|max:100',
            'user_id' => 'nullable|exists:users,user_id'
        ]);

        $forum = Forum::create([
            'user_id' => $request->user_id,
            'guest_name' => $request->guest_name,
            'isi_pesan' => $request->isi_pesan,
        ]);

        return response()->json($forum, 201);
    }

    // Hapus pesan forum (khusus admin/peneliti)
    public function destroy($id)
    {
        $forum = Forum::findOrFail($id);
        $forum->delete();

        return response()->json(['message' => 'Pesan forum berhasil dihapus']);
    }
}
