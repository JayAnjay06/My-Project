import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { ForumMessage, SendMessageData, RoleInfo, UserProfile } from '@/components/types/forum';
import { ForumService, ForumServicePh } from '@/components/services/forumService';
import { StorageService1, StorageServicePh } from '@/components/services/storageService';

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

//pemerintah
export interface UseForumPemerintahReturn {
  messages: ForumMessage[];
  isiPesan: string;
  guestName: string;
  loading: boolean;
  refreshing: boolean;
  sending: boolean;
  profile: UserProfile | null;
  error: string | null;
  setIsiPesan: (text: string) => void;
  setGuestName: (name: string) => void;
  fetchMessages: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  onRefresh: () => void;
  handleSend: () => Promise<void>;
  handleDelete: (forum_id: number) => Promise<void>;
  getRoleInfo: (role?: string, name?: string) => RoleInfo;
  formatTime: (dateString: string) => string;
  validateMessage: (message: string) => boolean;
  clearError: () => void;
}

export const useForumPemerintah = (): UseForumPemerintahReturn => {
  const [messages, setMessages] = useState<ForumMessage[]>([]);
  const [isiPesan, setIsiPesan] = useState("");
  const [guestName, setGuestName] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sending, setSending] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const fetchMessages = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      const token = await StorageServicePh.getToken();
      if (!token) {
        throw new Error('Token tidak ditemukan. Silakan login kembali.');
      }

      const messagesData = await ForumServicePh.fetchMessages(token);
      setMessages(messagesData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data';
      setError(errorMessage);
      console.error('Error in fetchMessages:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const fetchProfile = useCallback(async (): Promise<void> => {
    try {
      const token = await StorageServicePh.getToken();
      if (!token) {
        console.warn('Token tidak ditemukan untuk fetch profile');
        return;
      }

      const profileData = await ForumServicePh.fetchProfile(token);
      setProfile(profileData);
    } catch (err) {
      console.error('Error in fetchProfile:', err);
      // Profile fetch error is not critical, so we don't set error state
    }
  }, []);

  const onRefresh = useCallback((): void => {
    setRefreshing(true);
    fetchMessages();
  }, [fetchMessages]);

  const validateMessage = useCallback((message: string): boolean => {
    const trimmedMessage = message.trim();
    return trimmedMessage.length > 0 && trimmedMessage.length <= 500;
  }, []);

  const handleSend = useCallback(async (): Promise<void> => {
    if (!validateMessage(isiPesan)) {
      Alert.alert("Peringatan", "Pesan tidak boleh kosong dan maksimal 500 karakter!");
      return;
    }

    setSending(true);
    setError(null);
    
    try {
      const token = await StorageServicePh.getToken();
      if (!token) {
        throw new Error('Token tidak ditemukan. Silakan login kembali.');
      }

      const messageData: SendMessageData = {
        isi_pesan: isiPesan.trim(),
        guest_name: guestName || profile?.nama_lengkap || "Anonim",
      };

      await ForumServicePh.sendMessage(messageData, token);
      
      setIsiPesan("");
      setGuestName("");
      await fetchMessages();
    } catch (err) {
      console.error('Error in handleSend:', err);
      const errorMessage = err instanceof Error ? err.message : 'Gagal mengirim pesan';
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
    } finally {
      setSending(false);
    }
  }, [isiPesan, guestName, profile, validateMessage, fetchMessages]);

  const handleDelete = useCallback(async (forum_id: number): Promise<void> => {
    try {
      const token = await StorageServicePh.getToken();
      if (!token) {
        throw new Error('Token tidak ditemukan. Silakan login kembali.');
      }

      await ForumService.deleteMessage(forum_id, token);
      await fetchMessages();
      Alert.alert("Sukses", "Pesan berhasil dihapus");
    } catch (err) {
      console.error('Error in handleDelete:', err);
      const errorMessage = err instanceof Error ? err.message : 'Gagal menghapus pesan';
      Alert.alert("Error", errorMessage);
    }
  }, [fetchMessages]);

  const getRoleInfo = useCallback((role?: string, name?: string): RoleInfo => {
    const displayName = name || "Anonim";
    
    switch (role) {
      case "peneliti":
        return { 
          label: displayName, 
          color: "#2196F3",
          icon: "flask" as const,
          roleLabel: "#e3f2fd"
        };
      case "pemerintah":
        return { 
          label: displayName, 
          color: "#4CAF50",
          icon: "business" as const,
          roleLabel: "#e8f5e8"
        };
      default:
        return { 
          label: displayName, 
          color: "#666",
          icon: "person" as const,
          roleLabel: "#f5f5f5"
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
      if (diffMins < 60) return `${diffMins}m yang lalu`;
      if (diffHours < 24) return `${diffHours}j yang lalu`;
      if (diffDays < 7) return `${diffDays}h yang lalu`;
      
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return "Waktu tidak valid";
    }
  }, []);

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([fetchProfile(), fetchMessages()]);
    };
    
    initializeData();
  }, [fetchProfile, fetchMessages]);

  return {
    messages,
    isiPesan,
    guestName,
    loading,
    refreshing,
    sending,
    profile,
    error,
    setIsiPesan,
    setGuestName,
    fetchMessages,
    fetchProfile,
    onRefresh,
    handleSend,
    handleDelete,
    getRoleInfo,
    formatTime,
    validateMessage,
    clearError,
  };
};