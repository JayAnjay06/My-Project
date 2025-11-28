import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { Laporan, Analisis, AnalisisStats } from '@/components/types/analisis';

interface AnalisisTabProps {
  laporanList: Laporan[];
  selectedLaporan: string;
  setSelectedLaporan: (laporan: string) => void;
  loading: boolean;
  fetchLoading: boolean;
  hasil: Analisis | null;
  stats: AnalisisStats;
  onAnalisis: () => void;
  onBuatKeputusan: () => void;
  getSelectedLaporanData: () => Laporan | undefined;
  truncateText: (text: string, maxLength: number) => string;
  formatDate: (dateString: string) => string;
  getConfidenceColor: (confidence: number) => string;
  getKondisiColor: (kondisi: string) => string;
  getKondisiLabel: (kondisi: string) => string;
  getUrgensiColor: (urgensi: string) => string;
}

export const AnalisisTab: React.FC<AnalisisTabProps> = ({
  laporanList,
  selectedLaporan,
  setSelectedLaporan,
  loading,
  fetchLoading,
  hasil,
  stats,
  onAnalisis,
  onBuatKeputusan,
  getSelectedLaporanData,
  truncateText,
  formatDate,
  getConfidenceColor,
  getKondisiColor,
  getKondisiLabel,
  getUrgensiColor,
}) => {
  const laporanDenganFoto = laporanList.filter(l => l.foto);

  return (
    <View>
      {/* Stats Card */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Statistik Analisis</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#2196F3' }]}>
              <Ionicons name="document" size={20} color="white" />
            </View>
            <Text style={styles.statNumber}>{stats.totalLaporan}</Text>
            <Text style={styles.statLabel}>Total Laporan</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#4CAF50' }]}>
              <Ionicons name="image" size={20} color="white" />
            </View>
            <Text style={styles.statNumber}>{stats.laporanDenganFoto}</Text>
            <Text style={styles.statLabel}>Dengan Foto</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#FF9800' }]}>
              <Ionicons name="analytics" size={20} color="white" />
            </View>
            <Text style={styles.statNumber}>{stats.totalKeputusan}</Text>
            <Text style={styles.statLabel}>Keputusan</Text>
          </View>
        </View>
      </View>

      {/* Section Analisis Laporan */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Ionicons name="analytics" size={18} color="#2196F3" />
          Analisis AI Mangrove
        </Text>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedLaporan}
            onValueChange={(itemValue) => {
              setSelectedLaporan(itemValue);
            }}
            style={styles.picker}
          >
            <Picker.Item label="-- Pilih laporan dengan foto --" value="" />
            {laporanDenganFoto.map((laporan) => (
              <Picker.Item
                key={laporan.laporan_id}
                label={`${laporan.jenis_laporan} - ${laporan.lokasi?.nama_lokasi || 'Lokasi tidak tersedia'}`}
                value={laporan.laporan_id.toString()}
              />
            ))}
          </Picker>
        </View>

        {fetchLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#2196F3" />
            <Text style={styles.loadingText}>Memuat data laporan...</Text>
          </View>
        )}

        {selectedLaporan && !fetchLoading && (
          <View style={styles.selectedLaporan}>
            <Text style={styles.selectedTitle}>Laporan Terpilih:</Text>
            <Text style={styles.laporanJenis}>
              {getSelectedLaporanData()?.jenis_laporan}
            </Text>
            <Text style={styles.laporanIsi}>
              {truncateText(getSelectedLaporanData()?.isi_laporan || '', 100)}
            </Text>
            <View style={styles.laporanMeta}>
              <Text style={styles.laporanMetaText}>
                <Ionicons name="location" size={12} color="#666" />
                {getSelectedLaporanData()?.lokasi?.nama_lokasi || 'Lokasi tidak tersedia'}
              </Text>
              <Text style={styles.laporanMetaText}>
                <Ionicons name="calendar" size={12} color="#666" />
                {formatDate(getSelectedLaporanData()?.tanggal_laporan || "")}
              </Text>
              <Text style={styles.laporanMetaText}>
                <Ionicons name="image" size={12} color="#666" />
                {getSelectedLaporanData()?.foto ? 'Ada foto' : 'Tidak ada foto'}
              </Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.analisisButton,
            (!selectedLaporan || loading) && styles.buttonDisabled
          ]}
          onPress={onAnalisis}
          disabled={!selectedLaporan || loading}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Ionicons name="analytics" size={20} color="white" />
          )}
          <Text style={styles.analisisButtonText}>
            {loading ? "Menganalisis..." : "Jalankan Analisis AI"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Hasil Analisis AI */}
      {hasil && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
            Hasil Analisis AI
          </Text>

          <View style={styles.resultCard}>
            {/* Kondisi */}
            <View style={styles.resultRow}>
              <View style={styles.resultIcon}>
                <Ionicons name="heart" size={20} color={getKondisiColor(hasil.kondisi)} />
              </View>
              <View style={styles.resultContent}>
                <Text style={styles.resultLabel}>Kondisi Mangrove</Text>
                <View style={styles.statusBadge}>
                  <Text style={[styles.statusText, { color: getKondisiColor(hasil.kondisi) }]}>
                    {getKondisiLabel(hasil.kondisi)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Penyebab Kerusakan */}
            <View style={styles.resultRow}>
              <View style={styles.resultIcon}>
                <Ionicons name="warning" size={20} color="#FF9800" />
              </View>
              <View style={styles.resultContent}>
                <Text style={styles.resultLabel}>Penyebab Kerusakan</Text>
                <Text style={styles.resultValue}>{hasil.penyebab_kerusakan || 'Tidak terdeteksi'}</Text>
              </View>
            </View>

            {/* Tingkat Kepercayaan */}
            <View style={styles.resultRow}>
              <View style={styles.resultIcon}>
                <Ionicons name="stats-chart" size={20} color="#2196F3" />
              </View>
              <View style={styles.resultContent}>
                <Text style={styles.resultLabel}>Tingkat Kepercayaan AI</Text>
                <View style={styles.confidenceContainer}>
                  <View style={[
                    styles.confidenceBar,
                    {
                      width: `${(hasil.confidence || 0) * 100}%`,
                      backgroundColor: getConfidenceColor(hasil.confidence || 0)
                    }
                  ]} />
                </View>
                <Text style={[
                  styles.confidenceText,
                  { color: getConfidenceColor(hasil.confidence || 0) }
                ]}>
                  {((hasil.confidence || 0) * 100).toFixed(1)}%
                </Text>
              </View>
            </View>

            {/* Urgensi */}
            <View style={styles.resultRow}>
              <View style={styles.resultIcon}>
                <Ionicons name="alert-circle" size={20} color={getUrgensiColor(hasil.urgensi)} />
              </View>
              <View style={styles.resultContent}>
                <Text style={styles.resultLabel}>Tingkat Urgensi</Text>
                <View style={[styles.urgensiBadge, { backgroundColor: getUrgensiColor(hasil.urgensi) }]}>
                  <Text style={styles.urgensiText}>{hasil.urgensi}</Text>
                </View>
              </View>
            </View>

            {/* Rekomendasi */}
            <View style={styles.rekomendasiContainer}>
              <Text style={styles.rekomendasiLabel}>
                <Ionicons name="bulb" size={16} color="#FFC107" />
                Rekomendasi Penanganan AI
              </Text>
              <Text style={styles.rekomendasiText}>
                {hasil.rekomendasi_penanganan || 'Tidak ada rekomendasi'}
              </Text>
            </View>

            <View style={styles.footer}>
              <Ionicons name="time" size={12} color="#666" />
              <Text style={styles.footerText}>
                Dianalisis pada: {formatDate(hasil.tanggal_analisis)}
              </Text>
            </View>
          </View>

          {/* Tombol Buat Keputusan */}
          <TouchableOpacity
            style={styles.buatKeputusanButton}
            onPress={onBuatKeputusan}
          >
            <Ionicons name="add-circle" size={20} color="#2196F3" />
            <Text style={styles.buatKeputusanText}>Buat Keputusan Berdasarkan Analisis Ini</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Empty States untuk Analisis */}
      {laporanDenganFoto.length === 0 && laporanList.length > 0 && !fetchLoading && (
        <View style={styles.emptyState}>
          <Ionicons name="image-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>Tidak ada laporan dengan foto</Text>
          <Text style={styles.emptySubtitle}>
            Hanya laporan dengan foto yang bisa dianalisis oleh AI
          </Text>
        </View>
      )}
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
    shadowOffset: { width: 0, height: 2 },
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fafafa",
    overflow: "hidden",
    marginBottom: 12,
  },
  picker: {
    height: 50,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
  selectedLaporan: {
    backgroundColor: "#e3f2fd",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#2196F3",
    marginBottom: 12,
  },
  selectedTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2196F3",
    marginBottom: 4,
  },
  laporanJenis: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  laporanIsi: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
    lineHeight: 18,
  },
  laporanMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  laporanMetaText: {
    fontSize: 11,
    color: "#666",
    flexDirection: "row",
    alignItems: "center",
  },
  analisisButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2196F3",
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  analisisButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  resultCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  resultIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  resultContent: {
    flex: 1,
  },
  resultLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  urgensiBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgensiText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  confidenceContainer: {
    height: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
    marginVertical: 4,
    overflow: "hidden",
  },
  confidenceBar: {
    height: "100%",
    borderRadius: 3,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  rekomendasiContainer: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 6,
    marginTop: 8,
  },
  rekomendasiLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  rekomendasiText: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  footerText: {
    fontSize: 11,
    color: "#666",
    marginLeft: 4,
    fontStyle: "italic",
  },
  buatKeputusanButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e3f2fd",
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#2196F3",
    borderStyle: "dashed",
    marginTop: 16,
  },
  buatKeputusanText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2196F3",
    marginLeft: 8,
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