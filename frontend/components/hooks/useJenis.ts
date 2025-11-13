import { useState, useCallback } from 'react';
import { Jenis } from '@/components/types/jenis';
import { JenisService } from '@/components/services/jenisService';

export interface UseJenisReturn {
  jenisList: Jenis[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  expandedId: number | null;
  fetchJenis: () => Promise<void>;
  onRefresh: () => void;
  toggleExpand: (id: number) => void;
  truncateText: (text: string, maxLength: number) => string;
}

export const useJenis = (): UseJenisReturn => {
  const [jenisList, setJenisList] = useState<Jenis[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fetchJenis = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      const jenisData = await JenisService.fetchJenis();
      setJenisList(jenisData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data';
      setError(errorMessage);
      console.error('Error in fetchJenis:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = useCallback((): void => {
    setRefreshing(true);
    fetchJenis();
  }, [fetchJenis]);

  const toggleExpand = useCallback((id: number): void => {
    setExpandedId(prevId => prevId === id ? null : id);
  }, []);

  const truncateText = useCallback((text: string, maxLength: number): string => {
    if (!text) return "Tidak ada deskripsi";
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }, []);

  return {
    jenisList,
    loading,
    refreshing,
    error,
    expandedId,
    fetchJenis,
    onRefresh,
    toggleExpand,
    truncateText,
  };
};