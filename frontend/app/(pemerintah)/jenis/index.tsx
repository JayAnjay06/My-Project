import { API_IMAGE, API_URL } from "@/components/api/api";
import { Jenis } from "@/components/types/jenis";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function JenisMonitoring() {
  const [jenisList, setJenisList] = useState<Jenis[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchJenis = async () => {
    try {
      const res = await fetch(`${API_URL}/jenis`);
      const data = await res.json();
      setJenisList(data);
    } catch (err) {
      console.error("Gagal fetch jenis:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchJenis();
  };

  useEffect(() => {
    fetchJenis();
  }, []);

  const getStats = () => {
    return {
      totalJenis: jenisList.length,
    };
  };

  const stats = getStats();

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "-";
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  const renderStatsCard = () => (
    <View style={styles.statsContainer}>
      <Text style={styles.statsTitle}>Katalog Jenis Mangrove</Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#2196F3' }]}>
            <Ionicons name="leaf" size={20} color="white" />
          </View>
          <Text style={styles.statNumber}>{stats.totalJenis}</Text>
          <Text style={styles.statLabel}>Total Jenis</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#4CAF50' }]}>
            <Ionicons name="library" size={20} color="white" />
          </View>
          <Text style={styles.statNumber}>{stats.totalJenis}</Text>
          <Text style={styles.statLabel}>Tercatat</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#FF9800' }]}>
            <Ionicons name="document-text" size={20} color="white" />
          </View>
          <Text style={styles.statNumber}>{stats.totalJenis}</Text>
          <Text style={styles.statLabel}>Data Tersedia</Text>
        </View>
      </View>
    </View>
  );

  const renderItem = ({ item }: { item: Jenis }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        {item.gambar ? (
          <Image
            source={{
              uri: `${API_IMAGE}/storage/${item.gambar}`,
            }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.image, styles.placeholderImage]}>
            <Ionicons name="leaf-outline" size={40} color="#4CAF50" />
            <Text style={styles.placeholderText}>Gambar Tidak Tersedia</Text>
          </View>
        )}
        
        <View style={styles.textContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.namaLokal} numberOfLines={1}>
              {item.nama_lokal}
            </Text>
          </View>
          
          <Text style={styles.namaIlmiah} numberOfLines={1}>
            {item.nama_ilmiah}
          </Text>
          
          {item.deskripsi && (
            <Text style={styles.deskripsi} numberOfLines={3}>
              {truncateText(item.deskripsi, 120)}
            </Text>
          )}

          <View style={styles.footer}>
            <View style={styles.infoRow}>
              <Ionicons name="information-circle" size={14} color="#666" />
              <Text style={styles.infoText}>
                {item.deskripsi ? "Deskripsi tersedia" : "Tidak ada deskripsi"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="image" size={14} color="#666" />
              <Text style={styles.infoText}>
                {item.gambar ? "Gambar tersedia" : "Tidak ada gambar"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Memuat data jenis mangrove...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inventarisasi Jenis Mangrove</Text>
        <Text style={styles.headerSubtitle}>
          Katalog lengkap jenis mangrove yang tercatat
        </Text>
      </View>

      <FlatList
        data={jenisList}
        keyExtractor={(item) => item.jenis_id.toString()}
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
            <Ionicons name="leaf-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>Belum ada data jenis mangrove</Text>
            <Text style={styles.emptySubtitle}>
              Data inventarisasi jenis mangrove akan muncul di sini
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
  cardContent: {
    flexDirection: "row",
    padding: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  placeholderImage: {
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
  },
  placeholderText: {
    fontSize: 10,
    color: "#999",
    marginTop: 4,
    textAlign: "center",
  },
  textContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  namaLokal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2196F3",
    flex: 1,
    marginRight: 8,
  },
  namaIlmiah: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#4CAF50",
    marginBottom: 6,
  },
  deskripsi: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
    marginBottom: 8,
  },
  footer: {
    marginTop: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  infoText: {
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