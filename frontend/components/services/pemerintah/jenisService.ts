import { Jenis, JenisStats } from '@/components/types/jenis';
import { API_URL } from '@/components/api/api';

export class JenisServicePemerintah {
  static async fetchJenis(): Promise<Jenis[]> {
    try {
      const response = await fetch(`${API_URL}/jenis`, {
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
      throw new Error('Gagal memuat data jenis mangrove. Periksa koneksi internet Anda.');
    }
  }

  static calculateStats(jenisList: Jenis[]): JenisStats {
    return {
      totalJenis: jenisList.length,
    };
  }
}