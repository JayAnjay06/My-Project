// export type Laporan = {
//   laporan_id: number;
//   user_id?: number | null;
//   lokasi_id: number;
//   jenis_id?: number | null;
//   jenis_laporan: string;
//   isi_laporan: string;
//   foto?: string | null;
//   status: "pending" | "valid" | "ditolak";
//   tanggal_laporan: string;
//   user?: { name: string };
//   lokasi?: { nama_lokasi: string };
//   jenis?: {
//     nama_ilmiah: string, nama_lokal: string;
//   };
// };

export interface Laporan {
  laporan_id: number;
  jenis_laporan: string;
  isi_laporan: string;
  tanggal_laporan: string;
  status: string;
  lokasi?: {
    nama_lokasi: string;
  };
  user: {
    name: string;
    nama_lengkap: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface LaporanStats {
  total: number;
  valid: number;
  pending: number;
  ditolak: number;
}

export interface Lokasi {
  lokasi_id: number;
  nama_lokasi: string;
}

export interface CreateLaporanData {
  lokasi_id: number;
  jenis_laporan: string;
  isi_laporan: string;
  foto?: any;
}

export interface ImagePickerResult {
  uri: string;
  type?: string;
  name?: string;
}

//pemerintah
export interface LaporanUser {
  name?: string;
  nama_lengkap?: string;
}

export interface LaporanPh {
  laporan_id: number;
  jenis_laporan: string;
  isi_laporan: string;
  tanggal_laporan: string;
  status: string;
  lokasi?: Lokasi;
  user?: LaporanUser;
  created_at?: string;
  updated_at?: string;
}

export interface MonitoringStats {
  totalLaporan: number;
  topJenis: [string, number][];
}