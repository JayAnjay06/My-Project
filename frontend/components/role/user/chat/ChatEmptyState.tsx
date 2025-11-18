import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const ChatEmptyState: React.FC = () => {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>
        Selamat Datang! 👋
      </Text>
      <Text style={styles.emptyStateText}>
        Saya adalah asisten AI untuk informasi mangrove. 
        Silakan tanyakan apa saja tentang ekosistem mangrove!
      </Text>
      <View style={styles.suggestionContainer}>
        <Text style={styles.suggestionTitle}>Contoh pertanyaan:</Text>
        <Text style={styles.suggestion}>• Apa manfaat ekosistem mangrove?</Text>
        <Text style={styles.suggestion}>• Bagaimana cara menanam mangrove?</Text>
        <Text style={styles.suggestion}>• Jenis-jenis mangrove apa saja?</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  suggestionContainer: {
    backgroundColor: "#e8f5e8",
    padding: 16,
    borderRadius: 12,
    width: "100%",
  },
  suggestionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#228B22",
    marginBottom: 8,
  },
  suggestion: {
    fontSize: 13,
    color: "#555",
    marginBottom: 4,
  },
});