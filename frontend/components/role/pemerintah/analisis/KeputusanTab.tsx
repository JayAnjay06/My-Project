import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { Keputusan } from '@/components/types/analisis';

interface KeputusanTabProps {
  keputusanList: Keputusan[];
  hapusLoading: number | null;
  onHapusKeputusan: (keputusanId: number) => void;
  formatDate: (dateString: string) => string;
  formatCurrency: (amount: number) => string;
  truncateText: (text: string, maxLength: number) => string;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

export const KeputusanTab: React.FC<KeputusanTabProps> = ({
  keputusanList,
  hapusLoading,
  onHapusKeputusan,
  formatDate,
  formatCurrency,
  truncateText,
}) => {
  return (
    <View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Ionicons name="business" size={18} color="#2196F3" />
          Hasil Keputusan Pemerintah
        </Text>

        {keputusanList.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>Belum ada keputusan</Text>
            <Text style={styles.emptySubtitle}>
              Tidak ada keputusan yang tersedia saat ini
            </Text>
          </View>
        ) : (
          keputusanList.map((keputusan) => (
            <View key={keputusan.keputusan_id} style={styles.keputusanCard}>
              {/* Header dengan tombol hapus */}
              <View style={styles.cardHeader}>
                <View style={styles.laporanInfo}>
                  <Text style={styles.jenisLaporan}>
                    {keputusan.analisis?.laporan?.jenis_laporan || 'Laporan'}
                  </Text>
                  <Text style={styles.lokasi}>
                    {keputusan.analisis?.laporan?.lokasi?.nama_lokasi || 'Lokasi tidak tersedia'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.hapusButton}
                  onPress={() => onHapusKeputusan(keputusan.keputusan_id)}
                  disabled={hapusLoading === keputusan.keputusan_id}
                >
                  {hapusLoading === keputusan.keputusan_id ? (
                    <ActivityIndicator size="small" color="#F44336" />
                  ) : (
                    <Ionicons name="trash" size={18} color="#F44336" />
                  )}
                </TouchableOpacity>
              </View>

              {/* Tindakan */}
              <View style={styles.section}>
                <Text style={styles.label}>Tindakan yang Diambil:</Text>
                <Text style={styles.value}>{keputusan.tindakan_yang_diambil}</Text>
              </View>

              {/* Informasi Lainnya */}
              <View style={styles.detailsGrid}>
                {keputusan.anggaran && (
                  <View style={styles.detailItem}>
                    <Ionicons name="cash" size={16} color="#666" />
                    <Text style={styles.detailText}>
                      {formatCurrency(keputusan.anggaran)}
                    </Text>
                  </View>
                )}

                {keputusan.tanggal_mulai && (
                  <View style={styles.detailItem}>
                    <Ionicons name="calendar" size={16} color="#666" />
                    <Text style={styles.detailText}>
                      Mulai: {formatDate(keputusan.tanggal_mulai)}
                    </Text>
                  </View>
                )}

                {keputusan.tanggal_selesai && (
                  <View style={styles.detailItem}>
                    <Ionicons name="calendar" size={16} color="#666" />
                    <Text style={styles.detailText}>
                      Selesai: {formatDate(keputusan.tanggal_selesai)}
                    </Text>
                  </View>
                )}
              </View>

              {/* Catatan */}
              {keputusan.catatan && (
                <View style={styles.section}>
                  <Text style={styles.label}>Catatan:</Text>
                  <Text style={styles.value}>{keputusan.catatan}</Text>
                </View>
              )}

              {/* Footer */}
              <View style={styles.cardFooter}>
                <View style={styles.footerItem}>
                  <Ionicons name="person" size={12} color="#666" />
                  <Text style={styles.footerText}>
                    {keputusan.user?.name || 'Unknown'}
                  </Text>
                </View>
                <View style={styles.footerItem}>
                  <Ionicons name="time" size={12} color="#666" />
                  <Text style={styles.footerText}>
                    {formatDate(keputusan.created_at)}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  keputusanCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 12,
  },
  laporanInfo: {
    flex: 1,
  },
  jenisLaporan: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  lokasi: {
    fontSize: 14,
    color: "#666",
  },
  hapusButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: "#ffebee",
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2196F3",
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  detailText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    fontSize: 11,
    color: "#666",
    marginLeft: 4,
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