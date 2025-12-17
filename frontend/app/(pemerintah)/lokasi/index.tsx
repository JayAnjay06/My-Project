import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View
} from "react-native";
import React, { useEffect } from "react";
import { useLokasiPemerintah } from '@/components/hooks/pemerintah/useLokasi';
import { Ionicons } from "@expo/vector-icons";
import { StatsCard } from '@/components/role/pemerintah/lokasi/StatsCard';
import { LokasiCard } from '@/components/role/pemerintah/lokasi/LokasiCard';

export default function LokasiPemerintah() {
  const {
    data,
    loading,
    refreshing,
    error,
    stats,
    onRefresh,
    getStatusInfo,
    formatNumber,
    formatDate,
  } = useLokasiPemerintah();

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

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
        renderItem={({ item }) => (
          <LokasiCard
            item={item}
            getStatusInfo={getStatusInfo}
            formatNumber={formatNumber}
            formatDate={formatDate}
          />
        )}
        ListHeaderComponent={
          <StatsCard stats={stats} formatNumber={formatNumber} />
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