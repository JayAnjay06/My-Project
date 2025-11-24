import { Jenis, JenisStats } from '@/components/types/jenis';
import { API_URL } from '@/components/api/api';

export class JenisService {
  static async fetchJenis(): Promise<Jenis[]> {
    try {
      const response = await fetch(`${API_URL}/jenis`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching jenis:', error);
      throw new Error('Gagal memuat data jenis mangrove');
    }
  }

  static async fetchJenisById(id: number): Promise<Jenis> {
    try {
      const response = await fetch(`${API_URL}/jenis/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching jenis by id:', error);
      throw new Error('Gagal memuat detail jenis mangrove');
    }
  }
}

// pemerintah
export class JenisServicePh {
  static async fetchJenis(): Promise<Jenis[]> {
    try {
      console.log('Fetching jenis from:', `${API_URL}/jenis`);
      const response = await fetch(`${API_URL}/jenis`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Jenis fetched successfully:', data.length);
      return data;
    } catch (error) {
      console.error('Error fetching jenis:', error);
      throw new Error('Gagal memuat data jenis mangrove. Periksa koneksi internet Anda.');
    }
  }

  static calculateStats(jenisList: Jenis[]): JenisStats {
    return {
      totalJenis: jenisList.length,
    };
  }
}