import { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  Image, 
  Alert, 
  ScrollView, 
  StyleSheet, 
  ActivityIndicator,
  TouchableOpacity 
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { API_IMAGE, API_URL } from "@/components/api/api";
import { Laporan } from "@/components/types/laporan";

export default function LaporanDetail() {
  const { id } = useLocalSearchParams();
  const [laporan, setLaporan] = useState<Laporan | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const router = useRouter();

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${API_URL}/laporan/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      setLaporan(json);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Gagal memuat detail laporan");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status: "pending" | "valid" | "ditolak") => {
    try {
      setActionLoading(true);
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/laporan/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Network error");

      Alert.alert("Sukses", `Status laporan berhasil diubah menjadi ${getStatusLabel(status)}`);
      fetchDetail();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Gagal mengubah status laporan");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteLaporan = async () => {
    Alert.alert(
      "Konfirmasi Hapus",
      "Apakah Anda yakin ingin menghapus laporan ini? Tindakan ini tidak dapat dibatalkan.",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              setActionLoading(true);
              const token = await AsyncStorage.getItem("token");
              await fetch(`${API_URL}/laporan/${id}`, {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              Alert.alert("Sukses", "Laporan berhasil dihapus");
              router.back();
            } catch (err) {
              console.error(err);
              Alert.alert("Error", "Gagal menghapus laporan");
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "valid":
        return "#4CAF50";
      case "pending":
        return "#FF9800";
      case "ditolak":
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "valid":
        return "checkmark-circle";
      case "pending":
        return "time";
      case "ditolak":
        return "close-circle";
      default:
        return "alert-circle";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status?.toLowerCase()) {
      case "valid":
        return "Valid";
      case "pending":
        return "Pending";
      case "ditolak":
        return "Ditolak";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Memuat detail laporan...</Text>
      </View>
    );
  }

  if (!laporan) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="document-text-outline" size={64} color="#ccc" />
        <Text style={styles.errorText}>Laporan tidak ditemukan</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Laporan</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(laporan.status) }]}>
            <Ionicons name={getStatusIcon(laporan.status)} size={20} color="white" />
            <Text style={styles.statusText}>{getStatusLabel(laporan.status)}</Text>
          </View>
          <Text style={styles.jenisLaporan}>{laporan.jenis_laporan}</Text>
        </View>

        {/* Informasi Utama */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informasi Laporan</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="location" size={16} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Lokasi</Text>
              <Text style={styles.infoValue}>
                {laporan.lokasi?.nama_lokasi || "Tidak tersedia"}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="person" size={16} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Pelapor</Text>
              <Text style={styles.infoValue}>
                {laporan.user?.name || "Anonim"}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={16} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Tanggal Laporan</Text>
              <Text style={styles.infoValue}>
                {formatDate(laporan.tanggal_laporan)}
              </Text>
            </View>
          </View>
        </View>

        {/* Isi Laporan */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Isi Laporan</Text>
          <Text style={styles.isiLaporan}>{laporan.isi_laporan}</Text>
        </View>

        {/* Foto */}
        {laporan.foto && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Foto Lampiran</Text>
            <Image
              source={{ uri: `${API_IMAGE}/storage/${laporan.foto}` }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        )}

        {/* Action Buttons - Hanya untuk Peneliti */}
        <View style={styles.actionSection}>
          <Text style={styles.sectionTitle}>Verifikasi Laporan</Text>
          <Text style={styles.helperText}>
            Sebagai peneliti, Anda dapat memverifikasi status laporan ini
          </Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.statusButton, styles.validButton, actionLoading && styles.buttonDisabled]}
              onPress={() => updateStatus("valid")}
              disabled={actionLoading || laporan.status === "valid"}
            >
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text style={styles.statusButtonText}>
                {laporan.status === "valid" ? "Sudah Valid" : "Set Valid"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.statusButton, styles.rejectButton, actionLoading && styles.buttonDisabled]}
              onPress={() => updateStatus("ditolak")}
              disabled={actionLoading || laporan.status === "ditolak"}
            >
              <Ionicons name="close-circle" size={20} color="white" />
              <Text style={styles.statusButtonText}>
                {laporan.status === "ditolak" ? "Sudah Ditolak" : "Set Ditolak"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.statusButton, styles.pendingButton, actionLoading && styles.buttonDisabled]}
              onPress={() => updateStatus("pending")}
              disabled={actionLoading || laporan.status === "pending"}
            >
              <Ionicons name="time" size={20} color="white" />
              <Text style={styles.statusButtonText}>
                {laporan.status === "pending" ? "Masih Pending" : "Set Pending"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Delete Button - Hanya untuk pemilik laporan atau admin */}
          {laporan.user_id && (
            <TouchableOpacity 
              style={[styles.deleteButton, actionLoading && styles.buttonDisabled]}
              onPress={deleteLaporan}
              disabled={actionLoading}
            >
              <Ionicons name="trash" size={20} color="white" />
              <Text style={styles.deleteButtonText}>Hapus Laporan</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    padding: 4,
    width: 32,
  },
  backButtonText: {
    color: "#2196F3",
    fontSize: 16,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statusCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    alignItems: "center",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },
  statusText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  jenisLaporan: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2196F3",
    textAlign: "center",
  },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2196F3",
    marginBottom: 12,
  },
  helperText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  isiLaporan: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  actionSection: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  actionButtons: {
    marginBottom: 16,
  },
  statusButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  validButton: {
    backgroundColor: "#4CAF50",
  },
  rejectButton: {
    backgroundColor: "#F44336",
  },
  pendingButton: {
    backgroundColor: "#FF9800",
  },
  statusButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#dc3545",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dc3545",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    color: "#666",
    marginTop: 16,
    marginBottom: 24,
    textAlign: "center",
  },
});