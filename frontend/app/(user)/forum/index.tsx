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
    nama_lengkap?: string;
    role?: "peneliti" | "pemerintah" | "masyarakat";
  };
};

export default function ForumScreen() {
  const [messages, setMessages] = useState<ForumMessage[]>([]);
  const [isiPesan, setIsiPesan] = useState("");
  const [guestName, setGuestName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isNameSet, setIsNameSet] = useState(false);

  // Cek apakah user sudah punya nama
  useEffect(() => {
    const checkName = async () => {
      const storedName = await AsyncStorage.getItem("guestName");
      if (storedName) {
        setGuestName(storedName);
        setIsNameSet(true);
        fetchMessages();
      } else {
        setLoading(false);
      }
    };
    checkName();
  }, []);

  // Ambil data forum dari API
  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_URL}/forum`);
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

  const onRefresh = () => {
    setRefreshing(true);
    fetchMessages();
  };

  // Simpan nama user
  const handleSaveName = async () => {
    if (!guestName.trim()) {
      Alert.alert("Peringatan", "Nama tidak boleh kosong!");
      return;
    }
    
    if (guestName.trim().length < 2) {
      Alert.alert("Peringatan", "Nama minimal 2 karakter!");
      return;
    }

    try {
      await AsyncStorage.setItem("guestName", guestName.trim());
      setIsNameSet(true);
      fetchMessages();
    } catch (err) {
      console.error("Gagal simpan nama:", err);
      Alert.alert("Error", "Gagal menyimpan nama");
    }
  };

  // Kirim pesan baru
  const handleSend = async () => {
    if (!isiPesan.trim()) {
      Alert.alert("Peringatan", "Pesan tidak boleh kosong!");
      return;
    }

    if (isiPesan.trim().length < 3) {
      Alert.alert("Peringatan", "Pesan terlalu pendek!");
      return;
    }

    setSending(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${API_URL}/forum`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          isi_pesan: isiPesan.trim(),
          guest_name: guestName,
        }),
      });

      if (res.ok) {
        setIsiPesan("");
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

  const getRoleInfo = (role?: string, name?: string) => {
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
  };

  const formatTime = (dateString: string) => {
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
  };

  // Jika loading
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Memuat forum...</Text>
      </View>
    );
  }

  // Jika nama belum diset, tampilkan form input nama
  if (!isNameSet) {
    return (
      <View style={styles.nameContainer}>
        <View style={styles.nameHeader}>
          <Ionicons name="people" size={48} color="#4CAF50" />
          <Text style={styles.nameTitle}>Selamat Datang di Forum</Text>
          <Text style={styles.nameSubtitle}>
            Masukkan nama Anda untuk mulai berdiskusi
          </Text>
        </View>

        <View style={styles.nameForm}>
          <Text style={styles.nameLabel}>Nama Anda</Text>
          <TextInput
            style={styles.nameInput}
            placeholder="Contoh: Budi Santoso"
            value={guestName}
            onChangeText={setGuestName}
            maxLength={30}
            autoFocus
          />
          <Text style={styles.nameHelper}>
            Nama ini akan ditampilkan di forum dan tidak bisa diubah
          </Text>

          <TouchableOpacity 
            style={[
              styles.nameButton,
              (!guestName.trim() || guestName.trim().length < 2) && styles.buttonDisabled
            ]} 
            onPress={handleSaveName}
            disabled={!guestName.trim() || guestName.trim().length < 2}
          >
            <Text style={styles.nameButtonText}>Mulai Berdiskusi</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Render forum diskusi
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Forum Diskusi Mangrove</Text>
        <Text style={styles.headerSubtitle}>
          Diskusi bersama masyarakat, peneliti, dan pemerintah
        </Text>
        <View style={styles.userBadge}>
          <Ionicons name="person-circle" size={16} color="#666" />
          <Text style={styles.userName}>{guestName}</Text>
        </View>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item, index) =>
          item.forum_id?.toString() ?? index.toString()
        }
        renderItem={({ item }) => {
          const roleInfo = getRoleInfo(
            item.user?.role,
            item.user?.nama_lengkap ?? item.guest_name ?? "Anonim"
          );

          const isOwnMessage = item.guest_name === guestName;

          return (
            <View style={[
              styles.messageContainer,
              isOwnMessage && styles.ownMessageContainer
            ]}>
              <View style={styles.messageHeader}>
                <View style={styles.roleContainer}>
                  <Ionicons name={roleInfo.icon} size={12} color={roleInfo.color} />
                  <Text style={[styles.senderName, { color: roleInfo.color }]}>
                    {roleInfo.label}
                  </Text>
                  {roleInfo.roleLabel !== "Masyarakat" && (
                    <Text style={[styles.roleLabel, { color: roleInfo.color }]}>
                      • {roleInfo.roleLabel}
                    </Text>
                  )}
                </View>
                <Text style={styles.timeText}>{formatTime(item.created_at)}</Text>
              </View>
              
              <Text style={styles.messageText}>{item.isi_pesan}</Text>
            </View>
          );
        }}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#4CAF50"]}
            tintColor="#4CAF50"
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
              (!isiPesan.trim() || sending || isiPesan.trim().length < 3) && styles.sendButtonDisabled
            ]}
            onPress={handleSend}
            disabled={!isiPesan.trim() || sending || isiPesan.trim().length < 3}
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
  // Name Setup Styles
  nameContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 24,
    justifyContent: "center",
  },
  nameHeader: {
    alignItems: "center",
    marginBottom: 48,
  },
  nameTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  nameSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  nameForm: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  nameLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  nameInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#fafafa",
    marginBottom: 8,
  },
  nameHelper: {
    fontSize: 12,
    color: "#666",
    marginBottom: 24,
    lineHeight: 16,
  },
  nameButton: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  nameButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  // Forum Styles
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    lineHeight: 20,
  },
  userBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  userName: {
    fontSize: 14,
    color: "#333",
    marginLeft: 6,
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
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
    paddingTop: 0,
  },
  messageContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  ownMessageContainer: {
    backgroundColor: "#f0f9f0",
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  roleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  senderName: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  roleLabel: {
    fontSize: 10,
    fontWeight: "500",
    marginLeft: 4,
  },
  timeText: {
    fontSize: 11,
    color: "#999",
  },
  messageText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  inputContainer: {
    padding: 16,
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
    backgroundColor: "#4CAF50",
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
  buttonDisabled: {
    opacity: 0.6,
  },
});