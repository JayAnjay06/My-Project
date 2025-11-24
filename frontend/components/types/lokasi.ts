// export type Lokasi = {
//   lokasi_id: number;
//   nama_lokasi: string;
//   koordinat: string;
//   jumlah: number;
//   kerapatan: number;
//   tinggi_rata2: number;
//   diameter_rata2: number;
//   kondisi: "baik" | "sedang" | "buruk";
//   luas_area: number;
//   deskripsi: string;
//   tanggal_input: string;
// };

// export type FormState = {
//   lokasi_id: number | null;
//   nama_lokasi: string;
//   koordinat: string;
//   jumlah: string;
//   kerapatan: string;
//   tinggi_rata2: string;
//   diameter_rata2: string;
//   kondisi: "baik" | "sedang" | "buruk" | "";
//   luas_area: string;
//   deskripsi: string;
//   tanggal_input: Date | null;
// };

export interface Lokasi {
  lokasi_id: number;
  nama_lokasi: string;
  koordinat: string;
  deskripsi: string;
  kondisi: "baik" | "sedang" | "buruk";
  jumlah?: number;
  luas_area?: number;
  kerapatan?: number;
  tinggi_rata2?: number;
  diameter_rata2?: number;
  tanggal_input?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LokasiStats {
  totalLokasi: number;
  lokasiBaik: number;
  lokasiSedang: number;
  lokasiBuruk: number;
  totalPohon: number;
  totalLuas: number;
  kondisiBaik: number;
  kondisiSedang: number;
  kondisiBuruk: number;
}

// lokasi pemerintah
export interface StatusInfo {
  color: string;
  icon: "checkmark-circle" | "alert-circle" | "close-circle" | "help-circle";
}