import { API_URL } from "@/components/api/api";
import { Lokasi } from "@/components/types/lokasi";

export class LokasiServiceUser {
  static async fetchLokasi(): Promise<Lokasi[]> {
    try {
      const response = await fetch(`${API_URL}/lokasi`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Gagal memuat data lokasi. Periksa koneksi internet Anda.');
    }
  }
}