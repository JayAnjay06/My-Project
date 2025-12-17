import { Jenis, JenisStats } from '@/components/types/jenis';
import { JenisServicePemerintah } from '@/components/services/pemerintah/jenisService';
import { useCallback, useEffect, useState } from 'react';

export interface UseJenisMonitoringReturn {
  jenisList: Jenis[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  stats: JenisStats;
  fetchJenis: () => Promise<void>;
  onRefresh: () => void;
  truncateText: (text: string, maxLength: number) => string;
}

export const useJenisPemerintah = (): UseJenisMonitoringReturn => {
  const [jenisList, setJenisList] = useState<Jenis[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stats: JenisStats = {
    totalJenis: jenisList.length,
  };

  const fetchJenis = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      const jenisData = await JenisServicePemerintah.fetchJenis();
      setJenisList(jenisData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data';
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = useCallback((): void => {
    setRefreshing(true);
    fetchJenis();
  }, [fetchJenis]);

  const truncateText = useCallback((text: string, maxLength: number): string => {
    if (!text) return "-";
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }, []);

  useEffect(() => {
    fetchJenis();
  }, [fetchJenis]);

  return {
    jenisList,
    loading,
    refreshing,
    error,
    stats,
    fetchJenis,
    onRefresh,
    truncateText,
  };
};