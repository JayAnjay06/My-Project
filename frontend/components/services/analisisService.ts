import { Laporan, Analisis, Keputusan, KeputusanFormData, AnalisisStats } from '@/components/types/analisis';
import { API_URL } from '@/components/api/api';

export class AnalisisService {
  static async fetchLaporan(token: string): Promise<Laporan[]> {
    try {
      const response = await fetch(`${API_URL}/laporan`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
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
      return data;
    } catch (error) {
      console.error('Error fetching laporan:', error);
      throw new Error('Gagal memuat data laporan. Periksa koneksi internet Anda.');
    }
  }

  static async fetchKeputusan(token: string): Promise<Keputusan[]> {
    try {
      const response = await fetch(`${API_URL}/keputusan`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
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
      return data.success ? data.keputusan || [] : [];
    } catch (error) {
      console.error('Error fetching keputusan:', error);
      throw new Error('Gagal memuat data keputusan. Periksa koneksi internet Anda.');
    }
  }

  static async analisisLaporan(laporanId: string, token: string): Promise<Analisis> {
    try {
      const response = await fetch(`${API_URL}/laporan/${laporanId}/analyze`, {
        method: "POST",
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }
      
      const data = await response.json();      
      if (!data.success) {
        throw new Error(data.message || "Analisis gagal");
      }
      
      return data.analysis;
    } catch (error) {
      console.error('Error analyzing laporan:', error);
      throw new Error('Gagal melakukan analisis AI. Periksa koneksi internet Anda.');
    }
  }

  static async createKeputusan(keputusanData: any, token: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/keputusan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(keputusanData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP Error: ${response.status}`);
      }

      if (!data.success) {
        throw new Error(data.message || "Gagal membuat keputusan");
      }
    } catch (error) {
      console.error('Error creating keputusan:', error);
      throw new Error('Gagal membuat keputusan. Periksa koneksi internet Anda.');
    }
  }

  static async deleteKeputusan(keputusanId: number, token: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/keputusan/${keputusanId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP Error: ${response.status}`);
      }

      if (!data.success) {
        throw new Error(data.message || "Gagal menghapus keputusan");
      }
    } catch (error) {
      console.error('Error deleting keputusan:', error);
      throw new Error('Gagal menghapus keputusan. Periksa koneksi internet Anda.');
    }
  }

  static calculateStats(laporanList: Laporan[], keputusanList: Keputusan[]): AnalisisStats {
    return {
      totalLaporan: laporanList.length,
      totalKeputusan: keputusanList.length,
      laporanDenganFoto: laporanList.filter(laporan => laporan.foto).length,
    };
  }
}