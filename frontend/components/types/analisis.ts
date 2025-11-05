export interface Analisis {
  analisis_id: number;
  laporan_id: number;
  hasil_kondisi: string;
  confidence: number;
  kondisi: 'sehat' | 'rusak_ringan' | 'rusak_berat' | 'mati';
  penyebab_kerusakan: 'sampah' | 'limbah' | 'erosi' | 'ikan_pemakan' | 'alam' | 'lainnya';
  rekomendasi_penanganan: string;
  urgensi: 'rendah' | 'sedang' | 'tinggi' | 'kritis';
  tanggal_analisis: string;
  created_at?: string;
  updated_at?: string;
}