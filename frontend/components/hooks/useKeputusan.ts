import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { 
  Keputusan, 
  KeputusanFormData,
  AnalisisStats 
} from '@/components/types/analisis';
import { AnalisisService } from '@/components/services/analisisService';
import { StorageServicePh } from '@/components/services/storageService';

export interface UseKeputusanReturn {
  // State
  keputusanList: Keputusan[];
  loading: boolean;
  fetchLoading: boolean;
  refreshing: boolean;
  showKeputusanModal: boolean;
  keputusanLoading: boolean;
  hapusLoading: number | null;
  formData: KeputusanFormData;
  stats: AnalisisStats;

  // Setters
  setShowKeputusanModal: (show: boolean) => void;
  setFormData: (data: KeputusanFormData) => void;

  // Actions
  fetchKeputusan: () => Promise<void>;
  onRefresh: () => void;
  submitKeputusan: (analisisId: number, rekomendasi?: string) => Promise<void>;
  handleHapusKeputusan: (keputusanId: number) => void;
  openKeputusanModal: (rekomendasi?: string) => void;

  // Helpers
  truncateText: (text: string, maxLength: number) => string;
  formatDate: (dateString: string) => string;
  formatCurrency: (amount: number) => string;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

export const useKeputusan = (): UseKeputusanReturn => {
  const [keputusanList, setKeputusanList] = useState<Keputusan[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showKeputusanModal, setShowKeputusanModal] = useState(false);
  const [keputusanLoading, setKeputusanLoading] = useState(false);
  const [hapusLoading, setHapusLoading] = useState<number | null>(null);
  const [formData, setFormData] = useState<KeputusanFormData>({
    tindakan_yang_diambil: '',
    anggaran: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
    catatan: ''
  });

  const stats: AnalisisStats = AnalisisService.calculateStats([], keputusanList);

  const fetchKeputusan = useCallback(async (): Promise<void> => {
    try {
      const token = await StorageServicePh.getToken();
      if (!token) {
        throw new Error('Token tidak tersedia, silakan login ulang');
      }

      const keputusanData = await AnalisisService.fetchKeputusan(token);
      setKeputusanList(keputusanData);
    } catch (err) {
      console.error('Error in fetchKeputusan:', err);
      const errorMessage = err instanceof Error ? err.message : 'Gagal memuat data keputusan';
      Alert.alert("Error", errorMessage);
    } finally {
      setFetchLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async (): Promise<void> => {
    setRefreshing(true);
    await fetchKeputusan();
    setRefreshing(false);
  }, [fetchKeputusan]);

  const openKeputusanModal = useCallback((rekomendasi?: string): void => {
    setFormData({
      tindakan_yang_diambil: rekomendasi || '',
      anggaran: '',
      tanggal_mulai: '',
      tanggal_selesai: '',
      catatan: ''
    });
    setShowKeputusanModal(true);
  }, []);

  const submitKeputusan = useCallback(async (
    analisisId: number, 
    rekomendasi?: string
  ): Promise<void> => {
    if (!formData.tindakan_yang_diambil.trim()) {
      Alert.alert("Peringatan", "Tindakan yang diambil wajib diisi");
      return;
    }

    setKeputusanLoading(true);
    try {
      const token = await StorageServicePh.getToken();
      if (!token) {
        throw new Error('Token tidak tersedia, silakan login ulang');
      }

      const payload = {
        analisis_id: analisisId,
        tindakan_yang_diambil: formData.tindakan_yang_diambil,
        anggaran: formData.anggaran ? parseFloat(formData.anggaran) : null,
        tanggal_mulai: formData.tanggal_mulai || null,
        tanggal_selesai: formData.tanggal_selesai || null,
        catatan: formData.catatan || null
      };

      await AnalisisService.createKeputusan(payload, token);
      
      await fetchKeputusan();
      setShowKeputusanModal(false);
      Alert.alert("Sukses", "Keputusan berhasil dibuat");
    } catch (err) {
      console.error('Error in submitKeputusan:', err);
      const errorMessage = err instanceof Error ? err.message : 'Gagal membuat keputusan';
      Alert.alert("Error", errorMessage);
    } finally {
      setKeputusanLoading(false);
    }
  }, [formData, fetchKeputusan]);

  const handleHapusKeputusan = useCallback(async (keputusanId: number): Promise<void> => {
    Alert.alert(
      "Konfirmasi Hapus",
      "Apakah Anda yakin ingin menghapus keputusan ini?",
      [
        {
          text: "Batal",
          style: "cancel"
        },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            setHapusLoading(keputusanId);
            try {
              const token = await StorageServicePh.getToken();
              if (!token) {
                throw new Error('Token tidak tersedia');
              }

              await AnalisisService.deleteKeputusan(keputusanId, token);
              await fetchKeputusan();
              Alert.alert("Sukses", "Keputusan berhasil dihapus");
            } catch (err) {
              console.error('Error in handleHapusKeputusan:', err);
              const errorMessage = err instanceof Error ? err.message : 'Gagal menghapus keputusan';
              Alert.alert("Error", errorMessage);
            } finally {
              setHapusLoading(null);
            }
          }
        }
      ]
    );
  }, [fetchKeputusan]);

  // Helper functions
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

  const getStatusColor = useCallback((status: string): string => {
    switch (status?.toLowerCase()) {
      case 'direncanakan': return '#FF9800';
      case 'kerjakan': return '#4CAF50';
      case 'ditolak': return '#F44336';
      case 'selesai': return '#2196F3';
      default: return '#666';
    }
  }, []);

  const getStatusLabel = useCallback((status: string): string => {
    switch (status?.toLowerCase()) {
      case 'direncanakan': return 'Direncanakan';
      case 'kerjakan': return 'Dikerjakan';
      case 'ditolak': return 'Ditolak';
      case 'selesai': return 'Selesai';
      default: return status;
    }
  }, []);

  // Initialize data
  useEffect(() => {
    fetchKeputusan();
  }, [fetchKeputusan]);

  return {
    // State
    keputusanList,
    loading,
    fetchLoading,
    refreshing,
    showKeputusanModal,
    keputusanLoading,
    hapusLoading,
    formData,
    stats,

    // Setters
    setShowKeputusanModal,
    setFormData,

    // Actions
    fetchKeputusan,
    onRefresh,
    submitKeputusan,
    handleHapusKeputusan,
    openKeputusanModal,

    // Helpers
    truncateText,
    formatDate,
    formatCurrency,
    getStatusColor,
    getStatusLabel,
  };
};