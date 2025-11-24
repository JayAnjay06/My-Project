import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { LokasiStats } from '@/components/types/lokasi';

interface StatsCardProps {
  stats: LokasiStats;
  formatNumber: (num: number) => string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  stats,
  formatNumber,
}) => {
  return (
    <View style={styles.statsContainer}>
      <Text style={styles.statsTitle}>Overview Monitoring Mangrove</Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#2196F3' }]}>
            <Ionicons name="location" size={20} color="white" />
          </View>
          <Text style={styles.statNumber}>{stats.totalLokasi}</Text>
          <Text style={styles.statLabel}>Total Lokasi</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#4CAF50' }]}>
            <Ionicons name="leaf" size={20} color="white" />
          </View>
          <Text style={styles.statNumber}>{formatNumber(stats.totalPohon)}</Text>
          <Text style={styles.statLabel}>Total Pohon</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#FF9800' }]}>
            <Ionicons name="expand" size={20} color="white" />
          </View>
          <Text style={styles.statNumber}>{stats.totalLuas.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Luas (ha)</Text>
        </View>
      </View>

      {/* Kondisi Stats */}
      <View style={styles.conditionStats}>
        <View style={styles.conditionItem}>
          <View style={[styles.conditionDot, { backgroundColor: '#4CAF50' }]} />
          <Text style={styles.conditionText}>Baik: {stats.kondisiBaik}</Text>
        </View>
        <View style={styles.conditionItem}>
          <View style={[styles.conditionDot, { backgroundColor: '#FF9800' }]} />
          <Text style={styles.conditionText}>Sedang: {stats.kondisiSedang}</Text>
        </View>
        <View style={styles.conditionItem}>
          <View style={[styles.conditionDot, { backgroundColor: '#F44336' }]} />
          <Text style={styles.conditionText}>Buruk: {stats.kondisiBuruk}</Text>
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
    marginBottom: 16,
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
  conditionStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  conditionItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  conditionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  conditionText: {
    fontSize: 12,
    color: "#666",
  },
});