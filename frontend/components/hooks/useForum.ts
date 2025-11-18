import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { ForumMessage, SendMessageData, RoleInfo } from '@/components/types/forum';
import { ForumService } from '@/components/services/forumService';
import { StorageService1 } from '@/components/services/storageService';

export interface UseForumReturn {
  messages: ForumMessage[];
  isiPesan: string;
  guestName: string;
  loading: boolean;
  sending: boolean;
  refreshing: boolean;
  isNameSet: boolean;
  error: string | null;
  setIsiPesan: (text: string) => void;
  setGuestName: (name: string) => void;
  fetchMessages: () => Promise<void>;
  onRefresh: () => void;
  handleSaveName: () => Promise<void>;
  handleSend: () => Promise<void>;
  getRoleInfo: (role?: string, name?: string) => RoleInfo;
  formatTime: (dateString: string) => string;
  validateMessage: (message: string) => boolean;
  validateName: (name: string) => boolean;
  clearError: () => void;
}

export const useForum = (): UseForumReturn => {
  const [messages, setMessages] = useState<ForumMessage[]>([]);
  const [isiPesan, setIsiPesan] = useState("");
  const [guestName, setGuestName] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isNameSet, setIsNameSet] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  // Initialize forum data
  useEffect(() => {
    const initializeForum = async () => {
      try {
        const storedName = await StorageService1.getGuestName();
        if (storedName) {
          setGuestName(storedName);
          setIsNameSet(true);
          await fetchMessages();
        } else {
          setLoading(false);
        }
      } catch (err) {
        setError('Gagal memuat data forum');
        setLoading(false);
      }
    };
    
    initializeForum();
  }, []);

  const fetchMessages = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      const messagesData = await ForumService.fetchMessages();
      setMessages(messagesData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal memuat pesan forum';
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = useCallback((): void => {
    setRefreshing(true);
    fetchMessages();
  }, [fetchMessages]);

  const validateName = useCallback((name: string): boolean => {
    const trimmedName = name.trim();
    return trimmedName.length >= 2 && trimmedName.length <= 30;
  }, []);

  const validateMessage = useCallback((message: string): boolean => {
    const trimmedMessage = message.trim();
    return trimmedMessage.length >= 3 && trimmedMessage.length <= 500;
  }, []);

  const handleSaveName = useCallback(async (): Promise<void> => {
    if (!validateName(guestName)) {
      Alert.alert(
        "Peringatan", 
        guestName.trim().length < 2 
          ? "Nama minimal 2 karakter!" 
          : "Nama tidak boleh kosong!"
      );
      return;
    }

    try {
      await StorageService1.setGuestName(guestName);
      setIsNameSet(true);
      await fetchMessages();
    } catch (error) {
      Alert.alert("Error", "Gagal menyimpan nama");
    }
  }, [guestName, validateName, fetchMessages]);

  const handleSend = useCallback(async (): Promise<void> => {
    if (!validateMessage(isiPesan)) {
      Alert.alert(
        "Peringatan", 
        isiPesan.trim().length < 3 
          ? "Pesan terlalu pendek!" 
          : "Pesan tidak boleh kosong!"
      );
      return;
    }

    setSending(true);
    setError(null);
    
    try {
      const token = await StorageService1.getToken();
      const messageData: SendMessageData = {
        isi_pesan: isiPesan.trim(),
        guest_name: guestName,
      };

      await ForumService.sendMessage(messageData, token || undefined);
      
      setIsiPesan("");
      await fetchMessages();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal mengirim pesan';
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
    } finally {
      setSending(false);
    }
  }, [isiPesan, guestName, validateMessage, fetchMessages]);

  const getRoleInfo = useCallback((role?: string, name?: string): RoleInfo => {
    const displayName = name ?? "Anonim";
    
    switch (role) {
      case "peneliti":
        return { 
          label: displayName, 
          color: "#2196F3",
          icon: "flask" as const,
          roleLabel: "Peneliti"
        };
      case "pemerintah":
        return { 
          label: displayName, 
          color: "#4CAF50",
          icon: "business" as const,
          roleLabel: "Pemerintah"
        };
      default:
        return { 
          label: displayName, 
          color: "#666",
          icon: "person" as const,
          roleLabel: "Masyarakat"
        };
    }
  }, []);

  const formatTime = useCallback((dateString: string): string => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return "Baru saja";
      if (diffMins < 60) return `${diffMins}m lalu`;
      if (diffHours < 24) return `${diffHours}j lalu`;
      if (diffDays < 7) return `${diffDays}h lalu`;
      
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short'
      });
    } catch {
      return "Waktu tidak valid";
    }
  }, []);

  return {
    messages,
    isiPesan,
    guestName,
    loading,
    sending,
    refreshing,
    isNameSet,
    error,
    setIsiPesan,
    setGuestName,
    fetchMessages,
    onRefresh,
    handleSaveName,
    handleSend,
    getRoleInfo,
    formatTime,
    validateMessage,
    validateName,
    clearError,
  };
};