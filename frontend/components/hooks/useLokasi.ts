import { useState, useCallback } from 'react';
import { Lokasi } from '@/components/types/lokasi';
import { LokasiService } from '@/components/services/lokasiService';

export interface UseLokasiReturn {
  data: Lokasi[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  fetchLokasi: () => Promise<void>;
  onRefresh: () => void;
  getStatusColor: (kondisi: string) => string;
  getStatusIcon: (kondisi: string) => string;
  getStatusLabel: (kondisi: string) => string;
  formatNumber: (num: number) => string;
  formatDate: (dateString: string) => string;
  truncateText: (text: string, maxLength: number) => string;
}

export const useLokasi = (): UseLokasiReturn => {
  const [data, setData] = useState<Lokasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const getStatusColor = useCallback((kondisi: string): string => {
    switch (kondisi?.toLowerCase()) {
      case "baik":
        return "#4CAF50";
      case "sedang":
        return "#FF9800";
      case "buruk":
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  }, []);

  const getStatusIcon = useCallback((kondisi: string): string => {
    switch (kondisi?.toLowerCase()) {
      case "baik":
        return "checkmark-circle";
      case "sedang":
        return "alert-circle";
      case "buruk":
        return "close-circle";
      default:
        return "help-circle";
    }
  }, []);

  const getStatusLabel = useCallback((kondisi: string): string => {
    switch (kondisi?.toLowerCase()) {
      case "baik":
        return "Kondisi Baik";
      case "sedang":
        return "Perlu Perhatian";
      case "buruk":
        return "Perlu Perbaikan";
      default:
        return "Belum Dinilai";
    }
  }, []);

  const formatNumber = useCallback((num: number): string => {
    if (!num) return "0";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }, []);

  const formatDate = useCallback((dateString: string): string => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return "-";
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
    data,
    loading,
    refreshing,
    error,
    fetchLokasi,
    onRefresh,
    getStatusColor,
    getStatusIcon,
    getStatusLabel,
    formatNumber,
    formatDate,
    truncateText,
  };
};