import { Jenis } from '@/components/types/jenis';
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