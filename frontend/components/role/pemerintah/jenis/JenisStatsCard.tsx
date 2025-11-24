import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { JenisStats } from '@/components/types/jenis';

interface JenisStatsCardProps {
  stats: JenisStats;
}

export const JenisStatsCard: React.FC<JenisStatsCardProps> = ({ stats }) => {
  return (
    <View style={styles.statsContainer}>
      <Text style={styles.statsTitle}>Katalog Jenis Mangrove</Text>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#2196F3' }]}>
            <Ionicons name="leaf" size={20} color="white" />
          </View>
          <Text style={styles.statNumber}>{stats.totalJenis}</Text>
          <Text style={styles.statLabel}>Total Jenis</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#4CAF50' }]}>
            <Ionicons name="library" size={20} color="white" />
          </View>
          <Text style={styles.statNumber}>{stats.totalJenis}</Text>
          <Text style={styles.statLabel}>Tercatat</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#FF9800' }]}>
            <Ionicons name="document-text" size={20} color="white" />
          </View>
          <Text style={styles.statNumber}>{stats.totalJenis}</Text>
          <Text style={styles.statLabel}>Data Tersedia</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
});