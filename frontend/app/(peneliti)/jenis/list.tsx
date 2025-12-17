import { JenisCard } from '@/components/role/peneliti/jenis/JenisCard';
import { JenisEmptyState } from '@/components/role/peneliti/jenis/JenisEmptyState';
import { useJenisListPeneliti } from '@/components/hooks/peneliti/useJenis';
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

type Props = {
  onSelectForm: (mode: "create" | "edit", form?: any) => void;
};

export default function JenisList({ onSelectForm }: Props) {
  const {
    jenisList,
    loading,
    error,
    fetchJenis,
    truncateText,
    formatJenisToFormState,
    createEmptyFormState,
  } = useJenisListPeneliti();

  useEffect(() => {
    fetchJenis();
  }, [fetchJenis]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const handleCreateJenis = () => {
    onSelectForm("create", createEmptyFormState());
  };

  const handleEditJenis = (item: any) => {
    onSelectForm("edit", formatJenisToFormState(item));
  };

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
        <View>
          <Text style={styles.title}>Katalog Jenis Mangrove</Text>
          <Text style={styles.subtitle}>
            {jenisList.length} jenis mangrove tercatat
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleCreateJenis}
        >
          <Text style={styles.addButtonText}>Tambah Jenis</Text>
        </TouchableOpacity>
      </View>

      {jenisList.length === 0 ? (
        <JenisEmptyState onCreateJenis={handleCreateJenis} />
      ) : (
        <FlatList
          data={jenisList}
          keyExtractor={(item) => item.jenis_id.toString()}
          renderItem={({ item }) => (
            <JenisCard
              item={item}
              onPress={() => handleEditJenis(item)}
              truncateText={truncateText}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
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
    right: 5,
    top: 40,
  },
  addButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  listContainer: {
    padding: 16,
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
});