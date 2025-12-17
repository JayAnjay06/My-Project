export type FormState = {
  jenis_id: number | null;
  nama_ilmiah: string;
  nama_lokal: string;
  deskripsi: string;
  gambar: any;
};

export interface Jenis {
  jenis_id: number;
  nama_lokal: string;
  nama_ilmiah: string;
  deskripsi: string;
  gambar?: string;
  created_at?: string;
  updated_at?: string;
}

export interface JenisStats {
  totalJenis: number;
}

export interface JenisFormData {
  nama_ilmiah: string;
  nama_lokal: string;
  deskripsi: string;
  gambar?: any;
}

export interface ImagePickerAsset {
  uri: string;
  type?: string;
  name?: string;
}