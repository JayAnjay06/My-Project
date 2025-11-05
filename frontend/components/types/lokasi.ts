export type Lokasi = {
  lokasi_id: number;
  nama_lokasi: string;
  koordinat: string;
  jumlah: number;
  kerapatan: number;
  tinggi_rata2: number;
  diameter_rata2: number;
  kondisi: "baik" | "sedang" | "buruk";
  luas_area: number;
  deskripsi: string;
  tanggal_input: string;
};

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