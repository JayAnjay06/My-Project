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
import { useLaporan } from '@/components/hooks/useLaporan';
import { LaporanCard } from '@/components/role/user/laporan/LaporanCard';
import { LaporanEmptyState } from '@/components/role/user/laporan/LaporanEmptyState';

export default function LaporanList() {
  const router = useRouter();
  const {
    laporan,
    loading,
    refreshing,
    error,
    fetchLaporan,
    onRefresh,
    getStatusColor,
    getStatusIcon,
    getStatusLabel,
    formatDate,
    truncateText,
  } = useLaporan();

  useEffect(() => {
    fetchLaporan();
  }, [fetchLaporan]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const handleCreateLaporan = () => {
    router.push("/laporan/create");
  };

  const handleLaporanPress = (item: any) => {
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Memuat laporan Anda...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Laporan Saya</Text>
        <Text style={styles.headerSubtitle}>
          Pantau status laporan yang telah Anda kirimkan
        </Text>
      </View>

      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreateLaporan}
      >
        <Ionicons name="add-circle" size={20} color="white" />
        <Text style={styles.createButtonText}>Buat Laporan Baru</Text>
      </TouchableOpacity>

      <FlatList
        data={laporan}
        keyExtractor={(item) => item.laporan_id.toString()}
        renderItem={({ item }) => (
          <LaporanCard
            item={item}
            onPress={() => handleLaporanPress(item)}
            getStatusColor={getStatusColor}
            getStatusIcon={getStatusIcon}
            getStatusLabel={getStatusLabel}
            formatDate={formatDate}
            truncateText={truncateText}
          />
        )}
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
          <LaporanEmptyState onCreateLaporan={handleCreateLaporan} />
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
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
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
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
});