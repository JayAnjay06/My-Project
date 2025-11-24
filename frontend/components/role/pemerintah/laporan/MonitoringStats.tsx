import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { MonitoringStats as MonitoringStatsType } from '@/components/types/laporan';

interface MonitoringStatsProps {
  stats: MonitoringStatsType;
  getDotColor: (index: number) => string;
}

export const MonitoringStats: React.FC<MonitoringStatsProps> = ({
  stats,
  getDotColor,
}) => {
  return (
    <View style={styles.monitoringContainer}>
      <View style={styles.monitoringHeader}>
        <Text style={styles.monitoringTitle}>Monitoring Real-time</Text>
        <View style={styles.lastUpdate}>
          <Ionicons name="time" size={12} color="#666" />
          <Text style={styles.lastUpdateText}>Diperbarui saat ini</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.mainStat}>
          <Ionicons name="eye" size={24} color="#2196F3" />
          <Text style={styles.mainStatNumber}>{stats.totalLaporan}</Text>
          <Text style={styles.mainStatLabel}>Laporan Dipantau</Text>
        </View>

        <View style={styles.jenisStats}>
          <Text style={styles.jenisTitle}>Jenis Terbanyak:</Text>
          {stats.topJenis.map(([jenis, count], index) => (
            <View key={jenis} style={styles.jenisItem}>
              <View 
                style={[
                  styles.jenisDot, 
                  { backgroundColor: getDotColor(index) }
                ]} 
              />
              <Text style={styles.jenisText} numberOfLines={1}>
                {jenis} ({count})
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  monitoringContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  monitoringHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  monitoringTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  lastUpdate: {
    flexDirection: "row",
    alignItems: "center",
  },
  lastUpdateText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  statsGrid: {
    flexDirection: "row",
    alignItems: "center",
  },
  mainStat: {
    alignItems: "center",
    marginRight: 24,
  },
  mainStatNumber: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2196F3",
    marginVertical: 4,
  },
  mainStatLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  jenisStats: {
    flex: 1,
  },
  jenisTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  jenisItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  jenisDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  jenisText: {
    fontSize: 12,
    color: "#333",
    flex: 1,
  },
});