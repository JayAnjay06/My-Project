import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

interface LaporanEmptyStateProps {
  onCreateLaporan: () => void;
}

export const LaporanEmptyState: React.FC<LaporanEmptyStateProps> = ({
  onCreateLaporan,
}) => {
  return (
    <View style={styles.emptyState}>
      <Ionicons name="document-text-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>Belum ada laporan</Text>
      <Text style={styles.emptySubtitle}>
        Mulai dengan membuat laporan pertama Anda
      </Text>
      <TouchableOpacity 
        style={styles.emptyButton}
        onPress={onCreateLaporan}
      >
        <Text style={styles.emptyButtonText}>Buat Laporan Pertama</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: "#4CAF50",
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