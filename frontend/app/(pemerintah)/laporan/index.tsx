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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@/components/api/api";
import { Laporan } from "@/components/types/laporan";

export default function LaporanMonitoring() {
  const [laporan, setLaporan] = useState<Laporan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      
      // Coba ambil dari endpoint laporan-valid dulu
      try {
        const res = await fetch(`${API_URL}/laporan-valid`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (res.ok) {
          const json = await res.json();
          setLaporan(json);
          return;
        }
      } catch (error) {
        console.log("Endpoint laporan-valid belum tersedia, menggunakan fallback");
      }
      
      // Fallback: ambil semua laporan dan filter yang valid
      const allRes = await fetch(`${API_URL}/laporan`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const allData = await allRes.json();
      const validData = allData.filter((item: Laporan) => item.status === 'valid');
      setLaporan(validData);
      
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

  // Hitung statistik untuk monitoring
  const getMonitoringStats = () => {
    const totalLaporan = laporan.length;
    
    // Kelompokkan berdasarkan jenis laporan untuk monitoring
    const jenisCount: {[key: string]: number} = {};
    laporan.forEach(item => {
      const jenis = item.jenis_laporan || 'Lainnya';
      jenisCount[jenis] = (jenisCount[jenis] || 0) + 1;
    });

    // Ambil 3 jenis laporan terbanyak
    const topJenis = Object.entries(jenisCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    return {
      totalLaporan,
      topJenis
    };
  };

  const stats = getMonitoringStats();

  // Fungsi untuk mendapatkan warna dot berdasarkan index
  const getDotColor = (index: number) => {
    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1"];
    return colors[index] || "#999";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffHours < 168) return `${Math.floor(diffHours/24)} hari lalu`;
    return formatDate(dateString);
  };

  const renderMonitoringStats = () => (
    <View style={styles.monitoringContainer}>
      <View style={styles.monitoringHeader}>
        <Text style={styles.monitoringTitle}>Monitoring Real-time</Text>
        <View style={styles.lastUpdate}>
          <Ionicons name="time" size={12} color="#666" />
          <Text style={styles.lastUpdateText}>Diperbarui saat ini</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.mainStat}>
          <Ionicons name="eye" size={24} color="#2196F3" />
          <Text style={styles.mainStatNumber}>{stats.totalLaporan}</Text>
          <Text style={styles.mainStatLabel}>Laporan Dipantau</Text>
        </View>

        <View style={styles.jenisStats}>
          <Text style={styles.jenisTitle}>Jenis Terbanyak:</Text>
          {stats.topJenis.map(([jenis, count], index) => (
            <View key={jenis} style={styles.jenisItem}>
              <View 
                style={[
                  styles.jenisDot, 
                  { backgroundColor: getDotColor(index) }
                ]} 
              />
              <Text style={styles.jenisText} numberOfLines={1}>
                {jenis} ({count})
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Memulai monitoring...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Monitoring Laporan</Text>
          <Text style={styles.headerSubtitle}>Pantau laporan mangrove tervalidasi</Text>
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Ionicons name="refresh" size={20} color="#2196F3" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={laporan}
        keyExtractor={(item) => item.laporan_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.monitoringCard}>
            <View style={styles.cardHeader}>
              <View style={styles.jenisContainer}>
                <Text style={styles.jenisLaporan}>{item.jenis_laporan}</Text>
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
                  <Text style={styles.verifiedText}>Tervalidasi</Text>
                </View>
              </View>
              <Text style={styles.timeText}>{getTimeAgo(item.tanggal_laporan)}</Text>
            </View>

            <Text style={styles.isiLaporan} numberOfLines={2}>
              {item.isi_laporan || "Tidak ada deskripsi"}
            </Text>
            
            <View style={styles.monitoringInfo}>
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Ionicons name="location" size={14} color="#666" />
                  <Text style={styles.infoText}>
                    {item.lokasi?.nama_lokasi || "Lokasi tidak tersedia"}
                  </Text>
                </View>
                
                <View style={styles.infoItem}>
                  <Ionicons name="person" size={14} color="#666" />
                  <Text style={styles.infoText}>
                    {item.user?.name || "Anonim"}
                  </Text>
                </View>
              </View>
              
              <View style={styles.dateContainer}>
                <Ionicons name="calendar" size={12} color="#999" />
                <Text style={styles.dateText}>
                  {formatDate(item.tanggal_laporan)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListHeaderComponent={renderMonitoringStats}
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
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="analytics" size={48} color="#ccc" />
            <Text style={styles.emptyTitle}>Tidak ada data monitoring</Text>
            <Text style={styles.emptySubtitle}>
              Laporan tervalidasi akan muncul di sini untuk dipantau
            </Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  headerSubtitle: {
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
  monitoringContainer: {
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
  monitoringHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  monitoringTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  lastUpdate: {
    flexDirection: "row",
    alignItems: "center",
  },
  lastUpdateText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  statsGrid: {
    flexDirection: "row",
    alignItems: "center",
  },
  mainStat: {
    alignItems: "center",
    marginRight: 24,
  },
  mainStatNumber: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2196F3",
    marginVertical: 4,
  },
  mainStatLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  jenisStats: {
    flex: 1,
  },
  jenisTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  jenisItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  jenisDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  jenisText: {
    fontSize: 12,
    color: "#333",
    flex: 1,
  },
  monitoringCard: {
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
    borderLeftColor: "#4CAF50",
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
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: 'flex-start',
    backgroundColor: "#f0f9f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  verifiedText: {
    color: "#4CAF50",
    fontSize: 11,
    fontWeight: "500",
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
  monitoringInfo: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  infoText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 6,
    flex: 1,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  dateText: {
    fontSize: 11,
    color: "#999",
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
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});