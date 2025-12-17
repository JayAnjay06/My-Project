import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

interface JenisEmptyStateProps {
  onCreateJenis: () => void;
}

export const JenisEmptyState: React.FC<JenisEmptyStateProps> = ({
  onCreateJenis,
}) => {
  return (
    <View style={styles.emptyState}>
      <Ionicons name="leaf-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>Belum ada data jenis mangrove</Text>
      <Text style={styles.emptySubtitle}>
        Mulai dengan menambahkan jenis mangrove pertama Anda
      </Text>
      <TouchableOpacity 
        style={styles.emptyButton}
        onPress={onCreateJenis}
      >
        <Text style={styles.emptyButtonText}>Tambah Jenis Pertama</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    justifyContent: "center",
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
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});