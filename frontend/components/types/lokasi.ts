export type FormState = {
  lokasi_id: number | null;
  nama_lokasi: string;
  koordinat: string;
  jumlah: string;
  kerapatan: string;
  tinggi_rata2: string;
  diameter_rata2: string;
  kondisi: "baik" | "sedang" | "buruk" | "";
  luas_area: string;
  deskripsi: string;
  tanggal_input: Date | null;
};

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

export interface StatusInfo {
  color: string;
  icon: "checkmark-circle" | "alert-circle" | "close-circle" | "help-circle";
}

//Peneliti
export interface LokasiFormData {
  nama_lokasi: string;
  koordinat: string;
  jumlah?: number | null;
  kerapatan?: number | null;
  tinggi_rata2?: number | null;
  diameter_rata2?: number | null;
  kondisi?: string | null;
  luas_area?: number | null;
  deskripsi?: string | null;
  tanggal_input?: string | null;
}