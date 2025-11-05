import { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  RefreshControl 
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "@/components/api/api";
import { Laporan } from "@/components/types/laporan";

export default function LaporanPeneliti() {
  const [laporan, setLaporan] = useState<Laporan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}/laporan`);
      const json = await res.json();
      setLaporan(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Statistik untuk monitoring
  const getStats = () => {
    const total = laporan.length;
    const pending = laporan.filter(item => item.status === 'pending').length;
    const valid = laporan.filter(item => item.status === 'valid').length;
    const ditolak = laporan.filter(item => item.status === 'ditolak').length;
    
    return { total, pending, valid, ditolak };
  };

  const stats = getStats();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "#FF9800";
      case "valid":
        return "#4CAF50";
      case "ditolak":
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "hourglass";
      case "valid":
        return "checkmark-circle";
      case "ditolak":
        return "close-circle";
      default:
        return "alert-circle";
    }
  };

  const getPriorityColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "#FF6B35"; // Orange untuk butuh perhatian
      case "ditolak":
        return "#F44336"; // Red untuk ditolak
      default:
        return "transparent";
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text && text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 24) return `${diffHours} jam lalu`;
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short'
    });
  };

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <Text style={styles.statsTitle}>Dashboard Monitoring</Text>
      <Text style={styles.statsSubtitle}>Pantau dan validasi laporan masuk</Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: '#2196F3' }]}>
            <Ionicons name="documents" size={18} color="white" />
          </View>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>

        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: '#FF9800' }]}>
            <Ionicons name="time" size={18} color="white" />
          </View>
          <Text style={styles.statNumber}>{stats.pending}</Text>
          <Text style={styles.statLabel}>Perlu Validasi</Text>
        </View>

        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: '#4CAF50' }]}>
            <Ionicons name="checkmark" size={18} color="white" />
          </View>
          <Text style={styles.statNumber}>{stats.valid}</Text>
          <Text style={styles.statLabel}>Tervalidasi</Text>
        </View>
      </View>
    </View>
  );

  const renderItem = ({ item }: { item: Laporan }) => (
    <TouchableOpacity
      style={[
        styles.card,
        { borderLeftColor: getPriorityColor(item.status) }
      ]}
      onPress={() =>
        router.push({
          pathname: "/(peneliti)/laporan/[id]",
          params: { id: item.laporan_id.toString() },
        })
      }
    >
      <View style={styles.cardHeader}>
        <View style={styles.jenisContainer}>
          <Text style={styles.jenisLaporan}>{item.jenis_laporan}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Ionicons name={getStatusIcon(item.status)} size={12} color="white" />
            <Text style={styles.statusText}>
              {item.status === 'pending' ? 'Perlu Validasi' : 
               item.status === 'valid' ? 'Tervalidasi' : 'Ditolak'}
            </Text>
          </View>
        </View>
        <Text style={styles.timeText}>{formatDate(item.tanggal_laporan)}</Text>
      </View>

      <Text style={styles.isiLaporan} numberOfLines={2}>
        {truncateText(item.isi_laporan, 80)}
      </Text>

      <View style={styles.cardFooter}>
        <View style={styles.footerLeft}>
          <View style={styles.footerItem}>
            <Ionicons name="location" size={12} color="#666" />
            <Text style={styles.footerText}>
              {item.lokasi?.nama_lokasi || "Lokasi tidak tersedia"}
            </Text>
          </View>
          <View style={styles.footerItem}>
            <Ionicons name="person" size={12} color="#666" />
            <Text style={styles.footerText}>
              {item.user?.name || "Anonim"}
            </Text>
          </View>
        </View>
        
        {item.status === 'pending' && (
          <View style={styles.priorityBadge}>
            <Ionicons name="warning" size={12} color="#FFF" />
            <Text style={styles.priorityText}>Prioritas</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Memuat data monitoring...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Monitoring Laporan</Text>
          <Text style={styles.subtitle}>Dashboard Peneliti - Validasi Data</Text>
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Ionicons name="refresh" size={20} color="#2196F3" />
        </TouchableOpacity>
      </View>

      {laporan.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="analytics" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>Belum ada laporan</Text>
          <Text style={styles.emptySubtitle}>
            Laporan dari masyarakat akan muncul di sini untuk divalidasi
          </Text>
        </View>
      ) : (
        <FlatList
          data={laporan}
          keyExtractor={(item) => item.laporan_id.toString()}
          renderItem={renderItem}
          ListHeaderComponent={renderStats}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#2196F3"]}
              tintColor="#2196F3"
            />
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  refreshButton: {
    padding: 8,
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  statsContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  statsSubtitle: {
    fontSize: 12,
    color: "#666",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: "#666",
    textAlign: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  jenisContainer: {
    flex: 1,
  },
  jenisLaporan: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 6,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
    marginLeft: 4,
  },
  timeText: {
    fontSize: 12,
    color: "#2196F3",
    fontWeight: "500",
  },
  isiLaporan: {
    fontSize: 14,
    color: "#495057",
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  footerLeft: {
    flex: 1,
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  footerText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 6,
  },
  priorityBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF6B35",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  priorityText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
    marginLeft: 4,
  },
  separator: {
    height: 8,
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
  emptyState: {
    flex: 1,
    justifyContent: "center",
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