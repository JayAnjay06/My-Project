<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Laporan;
use App\Models\AiAnalisis;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class AiAnalisisController extends Controller
{
    private $apiKey;
    private $apiUrl = 'https://openrouter.ai/api/v1/chat/completions';

    public function __construct()
    {
        $this->apiKey = env('OPENROUTER_API_KEY');
    }

    public function analyzeLaporan($laporanId)
    {
        try {
            $laporan = Laporan::with(['lokasi', 'user'])->find($laporanId);
            
            if (!$laporan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Laporan tidak ditemukan'
                ], 404);
            }

            if (!$laporan->foto) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tidak ada gambar untuk dianalisis'
                ], 400);
            }

            $imageData = $this->imageToBase64($laporan->foto);
            $analysisResult = $this->analyzeWithOpenRouter($imageData, $laporan);
            $analysis = $this->createAnalysis($laporanId, $analysisResult);
            
            return response()->json([
                'success' => true,
                'analysis' => $analysis,
                'message' => 'Analisis AI berhasil'
            ]);
            
        } catch (\Exception $e) {
            \Log::error('AI Analysis Error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Analisis gagal: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getAnalysis($laporanId)
    {
        $analysis = AiAnalisis::where('laporan_id', $laporanId)
            ->with('laporan')
            ->first();

        if (!$analysis) {
            return response()->json([
                'success' => false,
                'message' => 'Analisis tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'analysis' => $analysis
        ]);
    }

    public function getAllAnalysis()
    {
        $analyses = AiAnalisis::with('laporan.lokasi')
            ->orderBy('tanggal_analisis', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'analyses' => $analyses
        ]);
    }

    public function deleteAnalysis($analisisId)
    {
        try {
            $analysis = AiAnalisis::find($analisisId);
            
            if (!$analysis) {
                return response()->json([
                    'success' => false,
                    'message' => 'Analisis tidak ditemukan'
                ], 404);
            }

            $analysis->delete();

            return response()->json([
                'success' => true,
                'message' => 'Analisis berhasil dihapus'
            ]);

        } catch (\Exception $e) {
            \Log::error('Delete Analysis Error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus analisis'
            ], 500);
        }
    }

    private function imageToBase64($fotoPath)
    {
        if (Storage::disk('public')->exists($fotoPath)) {
            $fileContent = Storage::disk('public')->get($fotoPath);
            $base64 = base64_encode($fileContent);
            $mimeType = Storage::disk('public')->mimeType($fotoPath) ?? 'image/jpeg';
            
            return "data:{$mimeType};base64,{$base64}";
        }
        
        throw new \Exception('Gambar tidak ditemukan: ' . $fotoPath);
    }

    private function analyzeWithOpenRouter($imageData, $laporan)
    {
        $prompt = $this->buildAnalysisPrompt($laporan);

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->apiKey,
            'Content-Type' => 'application/json',
            'HTTP-Referer' => env('APP_URL', 'https://localhost'),
            'X-Title' => 'Mangrove Care System',
        ])->timeout(60)->post($this->apiUrl, [
            'model' => 'x-ai/grok-4-fast:freeopenai/gpt-3.5-turbo',
            'messages' => [
                [
                    'role' => 'user',
                    'content' => [
                        ['type' => 'text', 'text' => $prompt],
                        ['type' => 'image_url', 'image_url' => ['url' => $imageData]]
                    ]
                ]
            ],
            'max_tokens' => 1000,
            'temperature' => 0.1
        ]);

        if (!$response->successful()) {
            $errorBody = $response->body();
            throw new \Exception('OpenRouter API error: ' . substr($errorBody, 0, 200));
        }

        $result = $response->json();
        
        if (!isset($result['choices'][0]['message']['content'])) {
            throw new \Exception('Invalid response format from AI');
        }

        $aiResponse = $result['choices'][0]['message']['content'];
        
        return $this->parseAiResponse($aiResponse);
    }

    private function buildAnalysisPrompt($laporan)
    {
        return "ANALISIS KONDISI MANGROVE

DATA LAPORAN:
- Jenis Laporan: {$laporan->jenis_laporan}
- Lokasi: {$laporan->lokasi->nama_lokasi}
- Deskripsi: {$laporan->isi_laporan}

TUGAS: Analisis gambar mangrove dan berikan assessment detail.

FORMAT OUTPUT (WAJIB JSON):
{
    \"kondisi\": \"sehat|rusak_ringan|rusak_berat|mati\",
    \"confidence\": 0.85,
    \"penyebab_kerusakan\": \"sampah|limbah|erosi|ikan_pemakan|alam|lainnya\",
    \"hasil_analisis\": \"Deskripsi detail kondisi\",
    \"rekomendasi\": \"Rekomendasi penanganan spesifik\"
}";
    }

    private function parseAiResponse($aiResponse)
    {
        if (preg_match('/\{.*\}/s', $aiResponse, $matches)) {
            $json = json_decode($matches[0], true);
            if (json_last_error() === JSON_ERROR_NONE) {
                return $json;
            }
        }

        return $this->parseManualResponse($aiResponse);
    }

    private function parseManualResponse($response)
    {
        $kondisi = $this->extractCondition($response);
        $penyebab = $this->extractCause($response);
        
        return [
            'kondisi' => $kondisi,
            'confidence' => 0.75,
            'penyebab_kerusakan' => $penyebab,
            'hasil_analisis' => substr($response, 0, 1000),
            'rekomendasi' => substr($this->generateRekomendasi($kondisi, $penyebab), 0, 500)
        ];
    }

    private function extractCondition($text)
    {
        $conditions = ['sehat', 'rusak_ringan', 'rusak_berat', 'mati'];
        foreach ($conditions as $condition) {
            if (stripos($text, $condition) !== false) {
                return $condition;
            }
        }
        return 'rusak_ringan';
    }

    private function extractCause($text)
    {
        $causes = ['sampah', 'limbah', 'erosi', 'ikan_pemakan', 'alam'];
        foreach ($causes as $cause) {
            if (stripos($text, $cause) !== false) {
                return $cause;
            }
        }
        return 'lainnya';
    }

    private function createAnalysis($laporanId, $analysisData)
    {
        // Batasi panjang text untuk safety
        $hasilKondisi = $analysisData['hasil_analisis'] ?? null;
        if ($hasilKondisi && strlen($hasilKondisi) > 2000) {
            $hasilKondisi = substr($hasilKondisi, 0, 1997) . '...';
        }

        $rekomendasi = $analysisData['rekomendasi'] ?? 'Perlu pemeriksaan lapangan';
        if (strlen($rekomendasi) > 1000) {
            $rekomendasi = substr($rekomendasi, 0, 997) . '...';
        }

        return AiAnalisis::create([
            'laporan_id' => $laporanId,
            'hasil_kondisi' => $hasilKondisi,
            'kondisi' => $analysisData['kondisi'] ?? 'rusak_ringan',
            'penyebab_kerusakan' => $analysisData['penyebab_kerusakan'] ?? 'lainnya',
            'confidence' => $analysisData['confidence'] ?? 0.7,
            'rekomendasi_penanganan' => $rekomendasi,
            'urgensi' => $this->calculateUrgensi($analysisData['kondisi'] ?? 'rusak_ringan'),
            'tanggal_analisis' => now(),
        ]);
    }

    private function calculateUrgensi($kondisi)
    {
        return match($kondisi) {
            'mati' => 'kritis',
            'rusak_berat' => 'tinggi',
            'rusak_ringan' => 'sedang',
            'sehat' => 'rendah',
            default => 'sedang'
        };
    }

    private function generateRekomendasi($kondisi, $penyebab)
    {
        $rekomendasi = [
            'sehat' => 'Lanjutkan pemantauan rutin',
            'rusak_ringan' => 'Pembersihan area dan pemupukan',
            'rusak_berat' => 'Penanaman ulang dan rehabilitasi',
            'mati' => 'Rehabilitasi total dan penanaman bibit baru'
        ];

        $rekomendasiText = $rekomendasi[$kondisi] ?? 'Perlu tindakan penanganan';
        
        return $rekomendasiText . " - Penyebab: " . $penyebab;
    }
}