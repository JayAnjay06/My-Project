// app/laporan-pemerintah.tsx
import React, { useEffect } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  RefreshControl,
  Alert
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useLaporanPemerintah } from '@/components/hooks/useLaporan';
import { MonitoringStats } from '@/components/role/pemerintah/laporan/MonitoringStats';
import { MonitoringCard } from '@/components/role/pemerintah/laporan/MonitoringCard';

export default function LaporanPemerintah() {
  const router = useRouter();
  const {
    laporan,
    loading,
    refreshing,
    error,
    stats,
    fetchData,
    onRefresh,
    getDotColor,
    formatDate,
    getTimeAgo,
    clearError,
  } = useLaporanPemerintah();

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error, [
        { text: "OK", onPress: clearError }
      ]);
    }
  }, [error, clearError]);

  const handleCardPress = (item: any) => {
    // Navigate to detail page if needed
    // router.push(`/laporan/${item.laporan_id}`);
  };

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
          <MonitoringCard
            item={item}
            onPress={() => handleCardPress(item)}
            formatDate={formatDate}
            getTimeAgo={getTimeAgo}
          />
        )}
        ListHeaderComponent={
          <MonitoringStats stats={stats} getDotColor={getDotColor} />
        }
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