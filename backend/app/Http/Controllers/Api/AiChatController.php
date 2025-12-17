<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AiChat;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiChatController extends Controller
{
    public function index()
    {
        $chats = AiChat::select('chat_id', 'pertanyaan', 'jawaban', 'tanggal_chat')
            ->orderBy('tanggal_chat', 'desc')
            ->get();

        return response()->json($chats);
    }

    public function store(Request $request)
    {
        $request->validate([
            'pertanyaan' => 'required|string',
        ]);

        $pertanyaan = $request->pertanyaan;
        $jawaban = "";
        $ai_status = "success";

        try {
            if (!preg_match('/mangrove/i', $pertanyaan)) {
                $jawaban = "Maaf, saya kurang mengerti pertanyaan Anda. Saya hanya bisa membantu seputar mangrove.";
            } else {
                $response = Http::withHeaders([
                    'Authorization' => 'Bearer ' . env('OPENROUTER_API_KEY_CHAT'),
                    'Content-Type'  => 'application/json',
                ])->post('https://openrouter.ai/api/v1/chat/completions', [
                    'model' => 'nvidia/nemotron-nano-12b-v2-vl:free',
                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => 'Kamu adalah asisten pakar mangrove. Jawablah hanya seputar tanaman mangrove dengan bahasa Indonesia sesuai EYD. Jangan gunakan emotikon, simbol, atau karakter aneh.'
                        ],
                        ['role' => 'user', 'content' => $pertanyaan],
                    ],
                ]);

                if ($response->failed()) {
                    $ai_status = "error";
                    $jawaban = "Gagal memanggil API OpenRouter. Status: " . $response->status() . 
                               " | Body: " . $response->body();

                    Log::error('AI Chat Error', [
                        'status' => $response->status(),
                        'body' => $response->body(),
                    ]);
                } else {
                    $jawaban = $response->json('choices.0.message.content')
                        ?? $response->json('choices.0.text')
                        ?? "Maaf, AI tidak merespon.";
                }
            }
        } catch (\Exception $e) {
            $ai_status = "error";
            $jawaban = "Terjadi kesalahan: " . $e->getMessage();
            Log::error('AI Chat Exception', ['message' => $e->getMessage()]);
        }

        $jawaban = preg_replace('/[^A-Za-z0-9À-ÿ\s\.,;:!\?]/u', '', $jawaban);
        $jawaban = str_replace(["\n", "\r"], ' ', $jawaban);
        $jawaban = preg_replace('/\s+/', ' ', $jawaban);

        $chat = AiChat::create([
            'user_id' => $request->user_id,
            'pertanyaan' => $pertanyaan,
            'jawaban' => trim($jawaban),
        ]);

        return response()->json([
            'status' => $ai_status,
            'data' => $chat
        ], $ai_status === "error" ? 500 : 201);
    }
}
