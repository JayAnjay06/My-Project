import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  StyleSheet,
  RefreshControl,
  ScrollView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Lokasi } from "@/components/types/lokasi";
import { API_URL } from "@/components/api/api";

export default function LokasiUserPage() {
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

  const getStatusLabel = (kondisi: string) => {
    switch (kondisi?.toLowerCase()) {
      case "baik":
        return "Kondisi Baik";
      case "sedang":
        return "Perlu Perhatian";
      case "buruk":
        return "Perlu Perbaikan";
      default:
        return "Belum Dinilai";
    }
  };

  const formatNumber = (num: number) => {
    if (!num) return "0";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "Tidak ada deskripsi";
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  const renderItem = ({ item }: { item: Lokasi }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.namaLokasi}>{item.nama_lokasi}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.kondisi) }]}>
          <Ionicons name={getStatusIcon(item.kondisi)} size={14} color="white" />
          <Text style={styles.statusText}>{getStatusLabel(item.kondisi)}</Text>
        </View>
      </View>

      <View style={styles.locationInfo}>
        <Ionicons name="location" size={16} color="#666" />
        <Text style={styles.coordinateText}>{item.koordinat}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Ionicons name="leaf" size={20} color="#4CAF50" />
          <View style={styles.statText}>
            <Text style={styles.statNumber}>{formatNumber(item.jumlah || 0)}</Text>
            <Text style={styles.statLabel}>Pohon</Text>
          </View>
        </View>

        <View style={styles.statItem}>
          <Ionicons name="expand" size={20} color="#2196F3" />
          <View style={styles.statText}>
            <Text style={styles.statNumber}>{item.luas_area || 0}</Text>
            <Text style={styles.statLabel}>Hektar</Text>
          </View>
        </View>

        <View style={styles.statItem}>
          <Ionicons name="speedometer" size={20} color="#FF9800" />
          <View style={styles.statText}>
            <Text style={styles.statNumber}>{item.kerapatan || 0}</Text>
            <Text style={styles.statLabel}>Pohon/m²</Text>
          </View>
        </View>
      </View>

      <View style={styles.measurements}>
        <View style={styles.measurement}>
          <Text style={styles.measurementLabel}>Tinggi Rata-rata</Text>
          <Text style={styles.measurementValue}>
            {item.tinggi_rata2 ? `${item.tinggi_rata2} meter` : 'Tidak ada data'}
          </Text>
        </View>
        <View style={styles.measurement}>
          <Text style={styles.measurementLabel}>Diameter Rata-rata</Text>
          <Text style={styles.measurementValue}>
            {item.diameter_rata2 ? `${item.diameter_rata2} cm` : 'Tidak ada data'}
          </Text>
        </View>
      </View>

      <View style={styles.description}>
        <Text style={styles.descriptionText}>
          {truncateText(item.deskripsi, 100)}
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.updateInfo}>
          <Ionicons name="calendar" size={12} color="#999" />
          <Text style={styles.updateText}>
            Diperbarui: {formatDate(item.tanggal_input || '')}
          </Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Memuat data lokasi mangrove...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lokasi Mangrove</Text>
        <Text style={styles.headerSubtitle}>
          Informasi lokasi penanaman dan kondisi mangrove di sekitar Anda
        </Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.lokasi_id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
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
            <Ionicons name="leaf-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>Belum ada data lokasi</Text>
            <Text style={styles.emptySubtitle}>
              Data lokasi mangrove akan muncul di sini
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
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  namaLokasi: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  coordinateText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    fontFamily: 'monospace',
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
  },
  statText: {
    marginLeft: 8,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  measurements: {
    marginBottom: 16,
  },
  measurement: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  measurementLabel: {
    fontSize: 14,
    color: "#666",
  },
  measurementValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  description: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  updateInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  updateText: {
    fontSize: 12,
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