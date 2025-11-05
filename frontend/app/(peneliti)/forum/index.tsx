import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "@/components/api/api";

type ForumMessage = {
  forum_id: number;
  user_id?: number | null;
  guest_name?: string | null;
  isi_pesan: string;
  created_at: string;
  user?: {
    nama_lengkap: string;
    role?: "peneliti" | "pemerintah" | "masyarakat";
  };
};

export default function ForumPeneliti() {
  const [messages, setMessages] = useState<ForumMessage[]>([]);
  const [isiPesan, setIsiPesan] = useState("");
  const [guestName, setGuestName] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sending, setSending] = useState(false);
  const [profile, setProfile] = useState<{ nama_lengkap: string; role: string } | null>(null);

  const fetchMessages = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${API_URL}/forum`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: ForumMessage[] = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Gagal fetch forum:", err);
      Alert.alert("Error", "Gagal memuat pesan forum");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error("Gagal fetch profile:", err);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMessages();
  };

  useEffect(() => {
    fetchProfile();
    fetchMessages();
  }, []);

  const handleSend = async () => {
    if (!isiPesan.trim()) {
      Alert.alert("Peringatan", "Pesan tidak boleh kosong!");
      return;
    }

    setSending(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${API_URL}/forum`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          isi_pesan: isiPesan,
          guest_name: guestName || profile?.nama_lengkap || "Anonim",
        }),
      });

      if (res.ok) {
        setIsiPesan("");
        setGuestName("");
        fetchMessages();
      } else {
        Alert.alert("Error", "Gagal mengirim pesan.");
      }
    } catch (err) {
      console.error("Gagal kirim pesan:", err);
      Alert.alert("Error", "Gagal mengirim pesan");
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (forum_id: number) => {
    Alert.alert(
      "Konfirmasi Hapus",
      "Apakah Anda yakin ingin menghapus pesan ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              const res = await fetch(`${API_URL}/forum/${forum_id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              });

              if (res.ok) {
                fetchMessages();
                Alert.alert("Sukses", "Pesan berhasil dihapus");
              } else {
                Alert.alert("Error", "Gagal menghapus pesan.");
              }
            } catch (err) {
              console.error("Gagal hapus pesan:", err);
              Alert.alert("Error", "Gagal menghapus pesan");
            }
          },
        },
      ]
    );
  };

  const getRoleInfo = (role?: string, name?: string) => {
    switch (role) {
      case "peneliti":
        return { 
          label: `${name}`, 
          color: "#2196F3",
          icon: "flask" as const,
          badgeColor: "#e3f2fd"
        };
      case "pemerintah":
        return { 
          label: `${name}`, 
          color: "#4CAF50",
          icon: "business" as const,
          badgeColor: "#e8f5e8"
        };
      default:
        return { 
          label: `${name}`, 
          color: "#666",
          icon: "person" as const,
          badgeColor: "#f5f5f5"
        };
    }
  };

  const formatTime = (dateString: string) => {
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
  };

  const renderMessage = ({ item }: { item: ForumMessage }) => {
    const roleInfo = getRoleInfo(
      item.user?.role,
      item.user?.nama_lengkap ?? item.guest_name ?? "Anonim"
    );

    const isOwnMessage = item.user?.nama_lengkap === profile?.nama_lengkap;

    return (
      <View style={[
        styles.messageContainer,
        isOwnMessage && styles.ownMessageContainer
      ]}>
        <View style={styles.messageHeader}>
          <View style={[styles.roleBadge, { backgroundColor: roleInfo.badgeColor }]}>
            <Ionicons name={roleInfo.icon} size={12} color={roleInfo.color} />
            <Text style={[styles.senderName, { color: roleInfo.color }]}>
              {roleInfo.label}
            </Text>
          </View>
          <Text style={styles.timeText}>{formatTime(item.created_at)}</Text>
        </View>
        
        <Text style={styles.messageText}>{item.isi_pesan}</Text>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.forum_id)}
        >
          <Ionicons name="trash-outline" size={16} color="#F44336" />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Memuat forum diskusi...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Forum Diskusi Mangrove</Text>
        <Text style={styles.headerSubtitle}>
          Diskusi dan berbagi informasi tentang mangrove
        </Text>
        <View style={styles.profileBadge}>
          <Ionicons name="person-circle" size={16} color="#2196F3" />
          <Text style={styles.profileText}>{profile?.nama_lengkap}</Text>
        </View>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item, index) => item.forum_id?.toString() ?? index.toString()}
        renderItem={renderMessage}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2196F3"]}
            tintColor="#2196F3"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="chatbubble-ellipses-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>Belum ada diskusi</Text>
            <Text style={styles.emptySubtitle}>
              Jadilah yang pertama memulai diskusi
            </Text>
          </View>
        }
        inverted={false}
      />

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="Tulis pesan untuk forum..."
            value={isiPesan}
            onChangeText={setIsiPesan}
            multiline
            maxLength={500}
            editable={!sending}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!isiPesan.trim() || sending) && styles.sendButtonDisabled
            ]}
            onPress={handleSend}
            disabled={!isiPesan.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="send" size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
        <Text style={styles.charCount}>
          {isiPesan.length}/500 karakter
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  profileBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    padding: 8,
    backgroundColor: "#f0f7ff",
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  profileText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginLeft: 6,
    marginRight: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#e0e0e0",
  },
  ownMessageContainer: {
    borderLeftColor: "#2196F3",
    backgroundColor: "#f0f7ff",
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  senderName: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  timeText: {
    fontSize: 11,
    color: "#999",
    position:'absolute',
    top:0,
    right:20
  },
  messageText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  deleteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 4,
  },
  inputContainer: {
    padding: 16,
    paddingVertical: 35,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 12,
    maxHeight: 100,
    backgroundColor: "#fafafa",
    marginRight: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sendButtonDisabled: {
    backgroundColor: "#ccc",
  },
  charCount: {
    fontSize: 11,
    color: "#999",
    textAlign: "right",
    marginTop: 4,
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    lineHeight: 20,
  },
});