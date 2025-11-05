import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Jenis } from "@/components/types/jenis";
import { API_IMAGE, API_URL } from "@/components/api/api";

export default function JenisMangroveUserPage() {
  const [jenisList, setJenisList] = useState<Jenis[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fetchJenis = async () => {
    try {
      const res = await fetch(`${API_URL}/jenis`);
      const data = await res.json();
      setJenisList(data);
    } catch (err) {
      console.error(err);
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

  const toggleExpand = (id: number) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "Tidak ada deskripsi";
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  const renderItem = ({ item }: { item: Jenis }) => {
    const isExpanded = expandedId === item.jenis_id;

    return (
      <TouchableOpacity
        style={[
          styles.card,
          isExpanded && styles.cardExpanded
        ]}
        onPress={() => toggleExpand(item.jenis_id)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.headerContent}>
            {item.gambar ? (
              <Image
                source={{
                  uri: `${API_IMAGE}/storage/${item.gambar}`,
                }}
                style={styles.image}
              />
            ) : (
              <View style={[styles.image, styles.placeholderImage]}>
                <Ionicons name="leaf" size={32} color="#4CAF50" />
                <Text style={styles.placeholderText}>Gambar Tidak Tersedia</Text>
              </View>
            )}
            
            <View style={styles.textContent}>
              <Text style={styles.namaLokal}>{item.nama_lokal}</Text>
              <Text style={styles.namaIlmiah}>{item.nama_ilmiah}</Text>
            </View>
          </View>

          <Ionicons 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#666" 
          />
        </View>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.divider} />
            
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>Deskripsi</Text>
              <Text style={styles.deskripsi}>
                {item.deskripsi || "Tidak ada deskripsi yang tersedia untuk jenis mangrove ini."}
              </Text>
            </View>

            <View style={styles.infoSection}>
              <View style={styles.infoItem}>
                <Ionicons name="image" size={16} color="#4CAF50" />
                <Text style={styles.infoText}>
                  {item.gambar ? "Gambar tersedia" : "Tidak ada gambar"}
                </Text>
              </View>
            </View>

            <View style={styles.actionSection}>
              <Text style={styles.tapInfo}>
                Tap untuk menutup
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Memuat jenis mangrove...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Jenis Mangrove</Text>
        <Text style={styles.headerSubtitle}>
          Ketuk untuk melihat detail setiap jenis mangrove
        </Text>
      </View>

      <FlatList
        data={jenisList}
        keyExtractor={(item) => item.jenis_id.toString()}
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
            <Text style={styles.emptyTitle}>Belum ada data jenis mangrove</Text>
            <Text style={styles.emptySubtitle}>
              Data jenis mangrove akan muncul di sini
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
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  cardExpanded: {
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    borderColor: "#4CAF50",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  image: {
    width: 60,
    height: 60,
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
    fontSize: 8,
    color: "#999",
    marginTop: 2,
    textAlign: "center",
  },
  textContent: {
    flex: 1,
  },
  namaLokal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 2,
  },
  namaIlmiah: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#4CAF50",
  },
  expandedContent: {
    marginTop: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginBottom: 12,
  },
  descriptionSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  deskripsi: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    textAlign: "justify",
  },
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 6,
  },
  actionSection: {
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  tapInfo: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
  },
  separator: {
    height: 8,
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