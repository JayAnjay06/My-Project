// export interface Analisis {
//   analisis_id: number;
//   laporan_id: number;
//   hasil_kondisi: string;
//   confidence: number;
//   kondisi: 'sehat' | 'rusak_ringan' | 'rusak_berat' | 'mati';
//   penyebab_kerusakan: 'sampah' | 'limbah' | 'erosi' | 'ikan_pemakan' | 'alam' | 'lainnya';
//   rekomendasi_penanganan: string;
//   urgensi: 'rendah' | 'sedang' | 'tinggi' | 'kritis';
//   tanggal_analisis: string;
//   created_at?: string;
//   updated_at?: string;
// }

export interface Laporan {
  laporan_id: number;
  jenis_laporan: string;
  isi_laporan: string;
  tanggal_laporan: string;
  status: string;
  foto?: string;
  lokasi?: {
    nama_lokasi: string;
  };
}

export interface Analisis {
  analisis_id: number;
  laporan_id: number;
  kondisi:  'sehat' | 'rusak_ringan' | 'rusak_berat' | 'mati';
  penyebab_kerusakan?: 'sampah' | 'limbah' | 'erosi' | 'ikan_pemakan' | 'alam' | 'lainnya';
  rekomendasi_penanganan?: string;
  confidence?: number;
  urgensi:  'rendah' | 'sedang' | 'tinggi' | 'kritis';
  tanggal_analisis: string;
  created_at?: string;
  updated_at?: string;
}

export interface Keputusan {
  keputusan_id: number;
  analisis_id: number;
  user_id: number;
  tindakan_yang_diambil: string;
  anggaran?: number;
  tanggal_mulai?: string;
  tanggal_selesai?: string;
  catatan?: string;
  created_at: string;
  updated_at: string;
  user?: {
    user_id: number;
    name: string;
    email: string;
  };
  analisis?: {
    laporan?: {
      jenis_laporan: string;
      lokasi?: {
        nama_lokasi: string;
      };
    };
  };
}

export interface KeputusanFormData {
  tindakan_yang_diambil: string;
  anggaran: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  catatan: string;
}

export interface AnalisisStats {
  totalLaporan: number;
  totalKeputusan: number;
  laporanDenganFoto: number;
}