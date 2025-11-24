import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { 
  Laporan, 
  Analisis, 
  AnalisisStats 
} from '@/components/types/analisis';
import { AnalisisService } from '@/components/services/analisisService';
import { StorageServicePh } from '@/components/services/storageService';

export interface UseAnalisisReturn {
  // State
  laporanList: Laporan[];
  selectedLaporan: string;
  loading: boolean;
  fetchLoading: boolean;
  refreshing: boolean;
  hasil: Analisis | null;
  stats: AnalisisStats;

  // Setters
  setSelectedLaporan: (laporan: string) => void;
  setHasil: (hasil: Analisis | null) => void;

  // Actions
  fetchLaporan: () => Promise<void>;
  onRefresh: () => void;
  handleAnalisis: () => Promise<void>;

  // Helpers
  getSelectedLaporanData: () => Laporan | undefined;
  truncateText: (text: string, maxLength: number) => string;
  formatDate: (dateString: string) => string;
  formatCurrency: (amount: number) => string;
  getConfidenceColor: (confidence: number) => string;
  getKondisiColor: (kondisi: string) => string;
  getKondisiLabel: (kondisi: string) => string;
  getUrgensiColor: (urgensi: string) => string;
}

export const useAnalisis = (): UseAnalisisReturn => {
  const [laporanList, setLaporanList] = useState<Laporan[]>([]);
  const [selectedLaporan, setSelectedLaporan] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [hasil, setHasil] = useState<Analisis | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const stats: AnalisisStats = AnalisisService.calculateStats(laporanList, []);

  const fetchLaporan = useCallback(async (): Promise<void> => {
    try {
      const token = await StorageServicePh.getToken();
      if (!token) {
        throw new Error('Token tidak tersedia, silakan login ulang');
      }

      const laporanData = await AnalisisService.fetchLaporan(token);
      setLaporanList(laporanData);
    } catch (err) {
      console.error('Error in fetchLaporan:', err);
      const errorMessage = err instanceof Error ? err.message : 'Gagal memuat data laporan';
      Alert.alert("Error", errorMessage);
    } finally {
      setFetchLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async (): Promise<void> => {
    setRefreshing(true);
    await fetchLaporan();
    setRefreshing(false);
  }, [fetchLaporan]);

  const handleAnalisis = useCallback(async (): Promise<void> => {
    if (!selectedLaporan) {
      Alert.alert("Peringatan", "Pilih laporan terlebih dahulu");
      return;
    }
    
    setLoading(true);
    setHasil(null);
    try {
      const token = await StorageServicePh.getToken();
      if (!token) {
        throw new Error('Token tidak tersedia, silakan login ulang');
      }

      const analysisResult = await AnalisisService.analisisLaporan(selectedLaporan, token);
      setHasil(analysisResult);
      Alert.alert("Sukses", "Analisis AI berhasil dilakukan");
    } catch (err) {
      console.error('Error in handleAnalisis:', err);
      const errorMessage = err instanceof Error ? err.message : 'Gagal melakukan analisis AI';
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  }, [selectedLaporan]);

  // Helper functions
  const getSelectedLaporanData = useCallback((): Laporan | undefined => {
    return laporanList.find(laporan => laporan.laporan_id.toString() === selectedLaporan);
  }, [laporanList, selectedLaporan]);

  const truncateText = useCallback((text: string, maxLength: number): string => {
    if (!text) return "-";
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }, []);

  const formatDate = useCallback((dateString: string): string => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return "Tanggal tidak valid";
    }
  }, []);

  const formatCurrency = useCallback((amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  }, []);

  const getConfidenceColor = useCallback((confidence: number): string => {
    if (confidence >= 0.8) return "#4CAF50";
    if (confidence >= 0.6) return "#FF9800";
    return "#F44336";
  }, []);

  const getKondisiColor = useCallback((kondisi: string): string => {
    switch (kondisi?.toLowerCase()) {
      case 'sehat': return '#4CAF50';
      case 'rusak_ringan': return '#FF9800';
      case 'rusak_berat': return '#F44336';
      case 'mati': return '#9C27B0';
      default: return '#666';
    }
  }, []);

  const getKondisiLabel = useCallback((kondisi: string): string => {
    switch (kondisi?.toLowerCase()) {
      case 'sehat': return 'Sehat';
      case 'rusak_ringan': return 'Rusak Ringan';
      case 'rusak_berat': return 'Rusak Berat';
      case 'mati': return 'Mati';
      default: return kondisi;
    }
  }, []);

  const getUrgensiColor = useCallback((urgensi: string): string => {
    switch (urgensi?.toLowerCase()) {
      case 'rendah': return '#4CAF50';
      case 'sedang': return '#FF9800';
      case 'tinggi': return '#F44336';
      case 'kritis': return '#9C27B0';
      default: return '#666';
    }
  }, []);

  // Initialize data
  useEffect(() => {
    fetchLaporan();
  }, [fetchLaporan]);

  return {
    // State
    laporanList,
    selectedLaporan,
    loading,
    fetchLoading,
    refreshing,
    hasil,
    stats,

    // Setters
    setSelectedLaporan,
    setHasil,

    // Actions
    fetchLaporan,
    onRefresh,
    handleAnalisis,

    // Helpers
    getSelectedLaporanData,
    truncateText,
    formatDate,
    formatCurrency,
    getConfidenceColor,
    getKondisiColor,
    getKondisiLabel,
    getUrgensiColor,
  };
};