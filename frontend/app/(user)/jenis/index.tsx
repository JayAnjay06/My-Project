import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useJenis } from '@/components/hooks/useJenis';
import { JenisCard } from '@/components/role/user/jenis/JenisCard';

export default function JenisMangroveUserPage() {
  const {
    jenisList,
    loading,
    refreshing,
    error,
    expandedId,
    fetchJenis,
    onRefresh,
    toggleExpand,
    truncateText,
  } = useJenis();

  useEffect(() => {
    fetchJenis();
  }, [fetchJenis]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const renderItem = ({ item }: { item: any }) => (
    <JenisCard
      item={item}
      isExpanded={expandedId === item.jenis_id}
      onPress={() => toggleExpand(item.jenis_id)}
      truncateText={truncateText}
    />
  );

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