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
import { Ionicons } from "@expo/vector-icons";
import { useLokasi } from '@/components/hooks/user/useLokasi';
import { LokasiCard } from '@/components/role/user/lokasi/LokasiCard';

export default function LokasiUserPage() {
  const {
    data,
    loading,
    refreshing,
    error,
    fetchLokasi,
    onRefresh,
    getStatusColor,
    getStatusIcon,
    getStatusLabel,
    formatNumber,
    formatDate,
    truncateText,
  } = useLokasi();

  useEffect(() => {
    fetchLokasi();
  }, [fetchLokasi]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const renderItem = ({ item }: { item: any }) => (
    <LokasiCard
      item={item}
      getStatusColor={getStatusColor}
      getStatusIcon={getStatusIcon}
      getStatusLabel={getStatusLabel}
      formatNumber={formatNumber}
      formatDate={formatDate}
      truncateText={truncateText}
    />
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