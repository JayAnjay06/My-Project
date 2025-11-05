export type Jenis = {
  jenis_id: number;
  nama_ilmiah: string;
  nama_lokal: string;
  deskripsi: string;
  gambar: string | null;
};

export type FormState = {
  jenis_id: number | null;
  nama_ilmiah: string;
  nama_lokal: string;
  deskripsi: string;
  gambar: any;
};
