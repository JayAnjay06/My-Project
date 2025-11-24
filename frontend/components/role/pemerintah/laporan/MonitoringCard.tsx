import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { Laporan } from '@/components/types/laporan';

interface MonitoringCardProps {
  item: Laporan;
  onPress?: () => void;
  formatDate: (dateString: string) => string;
  getTimeAgo: (dateString: string) => string;
}

export const MonitoringCard: React.FC<MonitoringCardProps> = ({
  item,
  onPress,
  formatDate,
  getTimeAgo,
}) => {
  return (
    <TouchableOpacity style={styles.monitoringCard} onPress={onPress}>
      <View style={styles.cardHeader}>
        <View style={styles.jenisContainer}>
          <Text style={styles.jenisLaporan}>{item.jenis_laporan}</Text>
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
            <Text style={styles.verifiedText}>Tervalidasi</Text>
          </View>
        </View>
        <Text style={styles.timeText}>{getTimeAgo(item.tanggal_laporan)}</Text>
      </View>

      <Text style={styles.isiLaporan} numberOfLines={2}>
        {item.isi_laporan || "Tidak ada deskripsi"}
      </Text>
      
      <View style={styles.monitoringInfo}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="location" size={14} color="#666" />
            <Text style={styles.infoText}>
              {item.lokasi?.nama_lokasi || "Lokasi tidak tersedia"}
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="person" size={14} color="#666" />
            <Text style={styles.infoText}>
              {item.user?.name || item.user?.nama_lengkap || "Anonim"}
            </Text>
          </View>
        </View>
        
        <View style={styles.dateContainer}>
          <Ionicons name="calendar" size={12} color="#999" />
          <Text style={styles.dateText}>
            {formatDate(item.tanggal_laporan)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  monitoringCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  jenisContainer: {
    flex: 1,
  },
  jenisLaporan: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 6,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: 'flex-start',
    backgroundColor: "#f0f9f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  verifiedText: {
    color: "#4CAF50",
    fontSize: 11,
    fontWeight: "500",
    marginLeft: 4,
  },
  timeText: {
    fontSize: 12,
    color: "#2196F3",
    fontWeight: "500",
  },
  isiLaporan: {
    fontSize: 14,
    color: "#495057",
    lineHeight: 20,
    marginBottom: 12,
  },
  monitoringInfo: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  infoText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 6,
    flex: 1,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  dateText: {
    fontSize: 11,
    color: "#999",
    marginLeft: 4,
  },
});