import { useCallback, useEffect, useState } from "react";
import { Lokasi, LokasiStats, StatusInfo } from "@/components/types/lokasi";
import { LokasiService } from "@/components/services/pemerintah/lokasiService";

export interface UseLokasiMonitoringReturn {
  data: Lokasi[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  stats: LokasiStats;
  fetchLokasi: () => Promise<void>;
  onRefresh: () => void;
  getStatusInfo: (kondisi: string) => StatusInfo;
  formatNumber: (num: number) => string;
  formatDate: (dateString: string) => string;
}

export const useLokasiPemerintah = (): UseLokasiMonitoringReturn => {
  const [data, setData] = useState<Lokasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate stats whenever data changes
  const stats: LokasiStats = {
    totalLokasi: data.length,
    totalPohon: data.reduce((sum, item) => sum + (item.jumlah || 0), 0),
    totalLuas: data.reduce((sum, item) => sum + (item.luas_area || 0), 0),
    kondisiBaik: data.filter(item => item.kondisi?.toLowerCase() === 'baik').length,
    kondisiSedang: data.filter(item => item.kondisi?.toLowerCase() === 'sedang').length,
    kondisiBuruk: data.filter(item => item.kondisi?.toLowerCase() === 'buruk').length,
    lokasiBaik: 0,
    lokasiSedang: 0,
    lokasiBuruk: 0
  };

  const fetchLokasi = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      const lokasiData = await LokasiService.fetchLokasi();
      setData(lokasiData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data';
      setError(errorMessage);
      console.error('Error in fetchLokasi:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = useCallback((): void => {
    setRefreshing(true);
    fetchLokasi();
  }, [fetchLokasi]);

  const getStatusInfo = useCallback((kondisi: string): StatusInfo => {
    switch (kondisi?.toLowerCase()) {
      case "baik":
        return { 
          color: "#4CAF50",
          icon: "checkmark-circle" as const
        };
      case "sedang":
        return { 
          color: "#FF9800",
          icon: "alert-circle" as const
        };
      case "buruk":
        return { 
          color: "#F44336",
          icon: "close-circle" as const
        };
      default:
        return { 
          color: "#9E9E9E",
          icon: "help-circle" as const
        };
    }
  }, []);

  const formatNumber = useCallback((num: number): string => {
    if (!num && num !== 0) return "0";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }, []);

  const formatDate = useCallback((dateString: string): string => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return "Tanggal tidak valid";
    }
  }, []);

  useEffect(() => {
    fetchLokasi();
  }, [fetchLokasi]);

  return {
    data,
    loading,
    refreshing,
    error,
    stats,
    fetchLokasi,
    onRefresh,
    getStatusInfo,
    formatNumber,
    formatDate,
  };
};