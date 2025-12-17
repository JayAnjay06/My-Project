import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import React, { useEffect } from "react";
import { useLokasiListPeneliti } from '@/components/hooks/peneliti/useLokasi';
import { LokasiCard } from '@/components/role/peneliti/lokasi/LokasiCard';
import { LokasiEmptyState } from '@/components/role/peneliti/lokasi/LokasiEmptyState';

type Props = {
  onSelectForm: (mode: "create" | "edit", form?: any) => void;
};

export default function LokasiList({ onSelectForm }: Props) {
  const {
    lokasiList,
    loading,
    error,
    fetchLokasi,
    formatDate,
    getStatusColor,
    formatLokasiToFormState,
    createEmptyFormState,
  } = useLokasiListPeneliti();

  useEffect(() => {
    fetchLokasi();
  }, [fetchLokasi]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const handleCreateLokasi = () => {
    onSelectForm("create", createEmptyFormState());
  };

  const handleEditLokasi = (item: any) => {
    onSelectForm("edit", formatLokasiToFormState(item));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Memuat data lokasi...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Daftar Lokasi Penelitian</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleCreateLokasi}
        >
          <Text style={styles.addButtonText}>Tambah Lokasi Baru</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>
        Total: {lokasiList.length} lokasi penelitian
      </Text>

      <FlatList
        data={lokasiList}
        keyExtractor={(item) => item.lokasi_id.toString()}
        renderItem={({ item }) => (
          <LokasiCard
            item={item}
            onPress={() => handleEditLokasi(item)}
            getStatusColor={getStatusColor}
            formatDate={formatDate}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <LokasiEmptyState onCreate={handleCreateLokasi} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    position: 'absolute',
    right: 1,
    top: 33,
  },
  addButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 20,
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
});