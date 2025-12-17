import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface LokasiEmptyStateProps {
  onCreate: () => void;
}

export const LokasiEmptyState: React.FC<LokasiEmptyStateProps> = ({
  onCreate,
}) => {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>Belum ada data lokasi penelitian</Text>
      <Text style={styles.emptySubtext}>
        Tekan "Tambah Lokasi Baru" untuk menambahkan data pertama
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyState: {
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});