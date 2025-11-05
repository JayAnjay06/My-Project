export type Laporan = {
  laporan_id: number;
  user_id?: number | null;
  lokasi_id: number;
  jenis_id?: number | null;
  jenis_laporan: string;
  isi_laporan: string;
  foto?: string | null;
  status: "pending" | "valid" | "ditolak";
  tanggal_laporan: string;
  user?: { name: string };
  lokasi?: { nama_lokasi: string };
  jenis?: {
    nama_ilmiah: string, nama_lokal: string;
  };
};
