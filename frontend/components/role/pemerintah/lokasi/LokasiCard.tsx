import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { Lokasi, StatusInfo } from '@/components/types/lokasi';

interface LokasiCardProps {
  item: Lokasi;
  getStatusInfo: (kondisi: string) => StatusInfo;
  formatNumber: (num: number) => string;
  formatDate: (dateString: string) => string;
}

export const LokasiCard: React.FC<LokasiCardProps> = ({
  item,
  getStatusInfo,
  formatNumber,
  formatDate,
}) => {
  const statusInfo = getStatusInfo(item.kondisi);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.namaLokasi}>{item.nama_lokasi}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
          <Ionicons name={statusInfo.icon} size={12} color="white" />
          <Text style={styles.statusText}>{item.kondisi || 'Tidak diketahui'}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Ionicons name="navigate" size={14} color="#666" />
          <Text style={styles.coordinateText}>{item.koordinat}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statItemLabel}>Jumlah</Text>
            <Text style={styles.statItemValue}>{formatNumber(item.jumlah || 0)}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statItemLabel}>Kerapatan</Text>
            <Text style={styles.statItemValue}>{item.kerapatan || 0}/m²</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statItemLabel}>Luas</Text>
            <Text style={styles.statItemValue}>{item.luas_area || 0} ha</Text>
          </View>
        </View>

        <View style={styles.measurements}>
          <View style={styles.measurementItem}>
            <Text style={styles.measurementLabel}>Tinggi Rata-rata</Text>
            <Text style={styles.measurementValue}>
              {item.tinggi_rata2 ? `${item.tinggi_rata2} m` : '-'}
            </Text>
          </View>
          <View style={styles.measurementItem}>
            <Text style={styles.measurementLabel}>Diameter Rata-rata</Text>
            <Text style={styles.measurementValue}>
              {item.diameter_rata2 ? `${item.diameter_rata2} cm` : '-'}
            </Text>
          </View>
        </View>

        {item.deskripsi && (
          <View style={styles.deskripsiContainer}>
            <Text style={styles.deskripsiLabel}>Catatan:</Text>
            <Text style={styles.deskripsiText} numberOfLines={2}>
              {item.deskripsi}
            </Text>
          </View>
        )}

        <View style={styles.cardFooter}>
          <View style={styles.footerInfo}>
            <Ionicons name="calendar" size={12} color="#666" />
            <Text style={styles.footerText}>
              Update: {formatDate(item.tanggal_input || '')}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  namaLokasi: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2196F3",
    flex: 1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
    marginLeft: 4,
  },
  cardBody: {
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  coordinateText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 6,
    fontFamily: 'monospace',
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statItemLabel: {
    fontSize: 11,
    color: "#666",
    marginBottom: 4,
  },
  statItemValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2196F3",
  },
  measurements: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  measurementItem: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#e3f2fd",
    padding: 8,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  measurementLabel: {
    fontSize: 11,
    color: "#1976D2",
    marginBottom: 2,
  },
  measurementValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1976D2",
  },
  deskripsiContainer: {
    backgroundColor: "#fff8e1",
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#FFC107",
  },
  deskripsiLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FF8F00",
    marginBottom: 2,
  },
  deskripsiText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 8,
  },
  footerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    fontSize: 11,
    color: "#666",
    marginLeft: 4,
  },
});