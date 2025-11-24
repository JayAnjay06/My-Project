import { useState, useCallback, useEffect } from 'react';
import { Laporan, MonitoringStats } from '@/components/types/laporan';
import { LaporanService, LaporanServicePh } from '@/components/services/laporanService';
import { StorageServicePh } from '../services/storageService';
import { formatDate, getTimeAgo } from '../utils/dateUtils';

export interface UseLaporanReturn {
  laporan: Laporan[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  fetchLaporan: () => Promise<void>;
  onRefresh: () => void;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => string;
  getStatusLabel: (status: string) => string;
  formatDate: (dateString: string) => string;
  truncateText: (text: string, maxLength: number) => string;
}

export const useLaporan = (): UseLaporanReturn => {
  const [laporan, setLaporan] = useState<Laporan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLaporan = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      const laporanData = await LaporanService.fetchLaporan();
      setLaporan(laporanData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data';
      setError(errorMessage);
      console.error('Error in fetchLaporan:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = useCallback((): void => {
    setRefreshing(true);
    fetchLaporan();
  }, [fetchLaporan]);

  const getStatusColor = useCallback((status: string): string => {
    switch (status?.toLowerCase()) {
      case "valid":
        return "#4CAF50";
      case "pending":
        return "#9C27B0";
      case "ditolak":
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  }, []);

  const getStatusIcon = useCallback((status: string): string => {
    switch (status?.toLowerCase()) {
      case "valid":
        return "checkmark-circle";
      case "pending":
        return "hourglass";
      case "ditolak":
        return "close-circle";
      default:
        return "alert-circle";
    }
  }, []);

  const getStatusLabel = useCallback((status: string): string => {
    switch (status?.toLowerCase()) {
      case "valid":
        return "Ditanggapi";
      case "pending":
        return "Menunggu";
      case "ditolak":
        return "Ditolak";
      default:
        return status;
    }
  }, []);

  const formatDate = useCallback((dateString: string): string => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return "Baru saja";
      if (diffMins < 60) return `${diffMins} menit lalu`;
      if (diffHours < 24) return `${diffHours} jam lalu`;
      if (diffDays < 7) return `${diffDays} hari lalu`;
      
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return "Tanggal tidak valid";
    }
  }, []);

  const truncateText = useCallback((text: string, maxLength: number): string => {
    if (!text) return "Tidak ada deskripsi";
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }, []);

  return {
    laporan,
    loading,
    refreshing,
    error,
    fetchLaporan,
    onRefresh,
    getStatusColor,
    getStatusIcon,
    getStatusLabel,
    formatDate,
    truncateText,
  };
};

//pemerintah
export interface UseLaporanPemerintahReturn {
  laporan: Laporan[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  stats: MonitoringStats;
  fetchData: () => Promise<void>;
  onRefresh: () => void;
  getDotColor: (index: number) => string;
  formatDate: (dateString: string) => string;
  getTimeAgo: (dateString: string) => string;
  clearError: () => void;
}

export const useLaporanPemerintah = (): UseLaporanPemerintahReturn => {
  const [laporan, setLaporan] = useState<Laporan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stats: MonitoringStats = LaporanServicePh.calculateMonitoringStats(laporan);

  const clearError = useCallback(() => setError(null), []);

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      const token = await StorageServicePh.getToken();
      if (!token) {
        throw new Error('Token tidak ditemukan. Silakan login kembali.');
      }

      const laporanData = await LaporanServicePh.fetchLaporanValid(token);
      setLaporan(laporanData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data';
      setError(errorMessage);
      // Tidak perlu log error di sini, sudah ditangani oleh Alert
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = useCallback((): void => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  const getDotColor = useCallback((index: number): string => {
    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1"];
    return colors[index] || "#999";
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    laporan,
    loading,
    refreshing,
    error,
    stats,
    fetchData,
    onRefresh,
    getDotColor,
    formatDate,
    getTimeAgo,
    clearError,
  };
};