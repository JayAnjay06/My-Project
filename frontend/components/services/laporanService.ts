import { CreateLaporanData, Laporan, LaporanStats, Lokasi, MonitoringStats } from '@/components/types/laporan';
import { API_URL } from '@/components/api/api';

export class LaporanService {
  static calculateMonitoringStats(laporan: Laporan[]): MonitoringStats {
    throw new Error('Method not implemented.');
  }
  static async fetchLaporan(): Promise<Laporan[]> {
    try {
      const response = await fetch(`${API_URL}/laporan`, {
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
      return data;
    } catch (error) {
      console.error('Error fetching laporan:', error);
      throw new Error('Gagal memuat data laporan. Periksa koneksi internet Anda.');
    }
  }

  static async fetchLaporanById(id: number): Promise<Laporan> {
    try {
      const response = await fetch(`${API_URL}/laporan/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching laporan by id:', error);
      throw new Error('Gagal memuat detail laporan');
    }
  }

  static calculateStats(laporanList: Laporan[]): LaporanStats {
    const total = laporanList.length;
    const valid = laporanList.filter(l => l.status?.toLowerCase() === 'valid').length;
    const pending = laporanList.filter(l => l.status?.toLowerCase() === 'pending').length;
    const ditolak = laporanList.filter(l => l.status?.toLowerCase() === 'ditolak').length;

    return {
      total,
      valid,
      pending,
      ditolak
    };
  }
}

export class LaporanService1 {
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
      throw new Error('Gagal memuat daftar lokasi. Periksa koneksi internet Anda.');
    }
  }

  static async createLaporan(laporanData: CreateLaporanData): Promise<void> {
    try {
      const formData = new FormData();
      formData.append("lokasi_id", laporanData.lokasi_id.toString());
      formData.append("jenis_laporan", laporanData.jenis_laporan);
      formData.append("isi_laporan", laporanData.isi_laporan);

      if (laporanData.foto) {
        const uriParts = laporanData.foto.uri.split(".");
        const fileType = uriParts[uriParts.length - 1];
        formData.append("foto", {
          uri: laporanData.foto.uri,
          name: `laporan_${Date.now()}.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      }

      const response = await fetch(`${API_URL}/laporan`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Network request failed')) {
          throw new Error('Gagal mengirim laporan. Periksa koneksi internet Anda.');
        } else if (error.message.includes('500')) {
          throw new Error('Server sedang mengalami masalah. Silakan coba lagi nanti.');
        }
      }
      
      throw new Error('Gagal mengirim laporan. Silakan coba lagi.');
    }
  }
}

//pemerintah
export class LaporanServicePh {
  static async fetchLaporanValid(token: string): Promise<Laporan[]> {
    try {
      // Coba endpoint laporan-valid terlebih dahulu
      try {
        const response = await fetch(`${API_URL}/laporan-valid`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          return data;
        }
      } catch (error) {
        // Silent fail, lanjut ke fallback
      }
      
      // Fallback: ambil semua laporan dan filter yang valid
      const allResponse = await fetch(`${API_URL}/laporan`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      
      if (!allResponse.ok) {
        const errorText = await allResponse.text();
        throw new Error(`HTTP ${allResponse.status}: ${allResponse.statusText}`);
      }
      
      const allData = await allResponse.json();
      const validData = allData.filter((item: Laporan) => 
        item.status?.toLowerCase() === 'valid'
      );
      
      return validData;
      
    } catch (error) {
      console.error('Error fetching valid laporan:', error);
      throw new Error('Gagal memuat data laporan tervalidasi. Periksa koneksi internet Anda.');
    }
  }

  static calculateMonitoringStats(laporanList: Laporan[]): MonitoringStats {
    const totalLaporan = laporanList.length;
    
    // Kelompokkan berdasarkan jenis laporan untuk monitoring
    const jenisCount: {[key: string]: number} = {};
    laporanList.forEach(item => {
      const jenis = item.jenis_laporan || 'Lainnya';
      jenisCount[jenis] = (jenisCount[jenis] || 0) + 1;
    });

    // Ambil 3 jenis laporan terbanyak
    const topJenis = Object.entries(jenisCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    return {
      totalLaporan,
      topJenis
    };
  }
}