import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  StyleSheet,
  ScrollView,
  RefreshControl 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Lokasi } from "@/components/types/lokasi";
import { API_URL } from "@/components/api/api";

export default function LokasiMonitoring() {
  const [data, setData] = useState<Lokasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchLokasi();
  }, []);

  const fetchLokasi = async () => {
    try {
      const res = await fetch(`${API_URL}/lokasi`);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchLokasi();
  };

  // Statistik untuk dashboard
  const getStats = () => {
    const totalLokasi = data.length;
    const totalPohon = data.reduce((sum, item) => sum + (item.jumlah || 0), 0);
    const totalLuas = data.reduce((sum, item) => sum + (item.luas_area || 0), 0);
    
    const kondisiBaik = data.filter(item => item.kondisi?.toLowerCase() === 'baik').length;
    const kondisiSedang = data.filter(item => item.kondisi?.toLowerCase() === 'sedang').length;
    const kondisiBuruk = data.filter(item => item.kondisi?.toLowerCase() === 'buruk').length;

    return {
      totalLokasi,
      totalPohon,
      totalLuas: totalLuas.toFixed(2),
      kondisiBaik,
      kondisiSedang,
      kondisiBuruk
    };
  };

  const stats = getStats();

  const getStatusColor = (kondisi: string) => {
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
  };

  const getStatusIcon = (kondisi: string) => {
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
  };

  const formatNumber = (num: number) => {
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderStatsCard = () => (
    <View style={styles.statsContainer}>
      <Text style={styles.statsTitle}>Overview Monitoring Mangrove</Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#2196F3' }]}>
            <Ionicons name="location" size={20} color="white" />
          </View>
          <Text style={styles.statNumber}>{stats.totalLokasi}</Text>
          <Text style={styles.statLabel}>Total Lokasi</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#4CAF50' }]}>
            <Ionicons name="leaf" size={20} color="white" />
          </View>
          <Text style={styles.statNumber}>{formatNumber(stats.totalPohon)}</Text>
          <Text style={styles.statLabel}>Total Pohon</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#FF9800' }]}>
            <Ionicons name="expand" size={20} color="white" />
          </View>
          <Text style={styles.statNumber}>{stats.totalLuas}</Text>
          <Text style={styles.statLabel}>Luas (ha)</Text>
        </View>
      </View>

      {/* Kondisi Stats */}
      <View style={styles.conditionStats}>
        <View style={styles.conditionItem}>
          <View style={[styles.conditionDot, { backgroundColor: '#4CAF50' }]} />
          <Text style={styles.conditionText}>Baik: {stats.kondisiBaik}</Text>
        </View>
        <View style={styles.conditionItem}>
          <View style={[styles.conditionDot, { backgroundColor: '#FF9800' }]} />
          <Text style={styles.conditionText}>Sedang: {stats.kondisiSedang}</Text>
        </View>
        <View style={styles.conditionItem}>
          <View style={[styles.conditionDot, { backgroundColor: '#F44336' }]} />
          <Text style={styles.conditionText}>Buruk: {stats.kondisiBuruk}</Text>
        </View>
      </View>
    </View>
  );

  const renderItem = ({ item }: { item: Lokasi }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.namaLokasi}>{item.nama_lokasi}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.kondisi) }]}>
          <Ionicons name={getStatusIcon(item.kondisi)} size={12} color="white" />
          <Text style={styles.statusText}>{item.kondisi || 'Tidak diketahui'}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Ionicons name="navigate" size={14} color="#666" />
          <Text style={styles.coordinateText}>{item.koordinat}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statItemLabel}>Jumlah</Text>
            <Text style={styles.statItemValue}>{formatNumber(item.jumlah || 0)}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statItemLabel}>Kerapatan</Text>
            <Text style={styles.statItemValue}>{item.kerapatan || 0}/m²</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statItemLabel}>Luas</Text>
            <Text style={styles.statItemValue}>{item.luas_area || 0} ha</Text>
          </View>
        </View>

        <View style={styles.measurements}>
          <View style={styles.measurementItem}>
            <Text style={styles.measurementLabel}>Tinggi Rata-rata</Text>
            <Text style={styles.measurementValue}>
              {item.tinggi_rata2 ? `${item.tinggi_rata2} m` : '-'}
            </Text>
          </View>
          <View style={styles.measurementItem}>
            <Text style={styles.measurementLabel}>Diameter Rata-rata</Text>
            <Text style={styles.measurementValue}>
              {item.diameter_rata2 ? `${item.diameter_rata2} cm` : '-'}
            </Text>
          </View>
        </View>

        {item.deskripsi && (
          <View style={styles.deskripsiContainer}>
            <Text style={styles.deskripsiLabel}>Catatan:</Text>
            <Text style={styles.deskripsiText} numberOfLines={2}>
              {item.deskripsi}
            </Text>
          </View>
        )}

        <View style={styles.cardFooter}>
          <View style={styles.footerInfo}>
            <Ionicons name="calendar" size={12} color="#666" />
            <Text style={styles.footerText}>
              Update: {formatDate(item.tanggal_input || '')}
            </Text>
          </View>
        </View>
      </View>
    </View>
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
        <Text style={styles.headerTitle}>Monitoring Mangrove</Text>
        <Text style={styles.headerSubtitle}>
          Pemantauan kondisi ekosistem mangrove
        </Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.lokasi_id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={renderStatsCard}
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
            <Ionicons name="location-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>Belum ada data lokasi</Text>
            <Text style={styles.emptySubtitle}>
              Data monitoring mangrove akan muncul di sini
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
    marginTop: 4,
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  conditionStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  conditionItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  conditionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  conditionText: {
    fontSize: 12,
    color: "#666",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  namaLokasi: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2196F3",
    flex: 1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
    marginLeft: 4,
  },
  cardBody: {
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  coordinateText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 6,
    fontFamily: 'monospace',
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statItemLabel: {
    fontSize: 11,
    color: "#666",
    marginBottom: 4,
  },
  statItemValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2196F3",
  },
  measurements: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  measurementItem: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#e3f2fd",
    padding: 8,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  measurementLabel: {
    fontSize: 11,
    color: "#1976D2",
    marginBottom: 2,
  },
  measurementValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1976D2",
  },
  deskripsiContainer: {
    backgroundColor: "#fff8e1",
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#FFC107",
  },
  deskripsiLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FF8F00",
    marginBottom: 2,
  },
  deskripsiText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 8,
  },
  footerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    fontSize: 11,
    color: "#666",
    marginLeft: 4,
  },
  separator: {
    height: 12,
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