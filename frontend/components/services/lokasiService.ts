import { Lokasi, LokasiStats } from '@/components/types/lokasi';
import { API_URL } from '@/components/api/api';

export class LokasiService {
  static async fetchLokasi(): Promise<Lokasi[]> {
    try {
      const response = await fetch(`${API_URL}/lokasi`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching lokasi:', error);
      throw new Error('Gagal memuat data lokasi');
    }
  }

  static async fetchLokasiById(id: number): Promise<Lokasi> {
    try {
      const response = await fetch(`${API_URL}/lokasi/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching lokasi by id:', error);
      throw new Error('Gagal memuat detail lokasi');
    }
  }

  static calculateStats(lokasiList: Lokasi[]): LokasiStats {
    const totalLokasi = lokasiList.length;
    const lokasiBaik = lokasiList.filter(l => l.kondisi?.toLowerCase() === 'baik').length;
    const lokasiSedang = lokasiList.filter(l => l.kondisi?.toLowerCase() === 'sedang').length;
    const lokasiBuruk = lokasiList.filter(l => l.kondisi?.toLowerCase() === 'buruk').length;
    const totalPohon = lokasiList.reduce((sum, l) => sum + (l.jumlah || 0), 0);
    const totalLuas = lokasiList.reduce((sum, l) => sum + (l.luas_area || 0), 0);

    return {
      totalLokasi,
      lokasiBaik,
      lokasiSedang,
      lokasiBuruk,
      totalPohon,
      totalLuas
    };
  }
}