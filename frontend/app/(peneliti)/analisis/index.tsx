import { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator, 
  ScrollView, 
  StyleSheet,
  Alert,
  RefreshControl
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "@/components/api/api";
import { Laporan } from "@/components/types/laporan";
import { Analisis } from "@/components/types/analisis";

interface Keputusan {
  keputusan_id: number;
  analisis_id: number;
  user_id: number;
  tindakan_yang_diambil: string;
  anggaran?: number;
  tanggal_mulai?: string;
  tanggal_selesai?: string;
  catatan?: string;
  created_at: string;
  updated_at: string;
  user?: {
    user_id: number;
    name: string;
    email: string;
  };
  analisis?: {
    laporan?: {
      jenis_laporan: string;
      lokasi?: {
        nama_lokasi: string;
      };
    };
  };
}

export default function AnalisisDanKeputusan() {
  const [laporanList, setLaporanList] = useState<Laporan[]>([]);
  const [selectedLaporan, setSelectedLaporan] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [hasil, setHasil] = useState<Analisis | null>(null);
  const [keputusanList, setKeputusanList] = useState<Keputusan[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'analisis' | 'keputusan'>('analisis');

  // Fetch semua data
  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      
      // Fetch laporan
      const laporanRes = await fetch(`${API_URL}/laporan`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const laporanData = await laporanRes.json();
      setLaporanList(laporanData);

      // Fetch keputusan
      const keputusanRes = await fetch(`${API_URL}/keputusan`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (keputusanRes.ok) {
        const keputusanData = await keputusanRes.json();
        if (keputusanData.success) {
          setKeputusanList(keputusanData.keputusan || []);
        }
      }
    } catch (err) {
      console.error("Gagal fetch data:", err);
      Alert.alert("Error", "Gagal memuat data");
    } finally {
      setFetchLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // SISTEM AI - Analisis Laporan
  const handleAnalisis = async () => {
    if (!selectedLaporan) {
      Alert.alert("Peringatan", "Pilih laporan terlebih dahulu");
      return;
    }
    
    setLoading(true);
    setHasil(null);
    try {
      const token = await AsyncStorage.getItem("token");
      
      const res = await fetch(`${API_URL}/laporan/${selectedLaporan}/analyze`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Network error");
      }
      
      const json = await res.json();
      
      if (json.success) {
        setHasil(json.analysis);
        Alert.alert("Sukses", "Analisis AI berhasil dilakukan");
      } else {
        throw new Error(json.message || "Analisis gagal");
      }
      
    } catch (err: any) {
      console.error("Gagal analisis:", err);
      Alert.alert("Error", err.message || "Gagal melakukan analisis AI");
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const getSelectedLaporanData = () => {
    return laporanList.find(laporan => laporan.laporan_id.toString() === selectedLaporan);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "-";
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "#4CAF50";
    if (confidence >= 0.6) return "#FF9800";
    return "#F44336";
  };

  const getKondisiColor = (kondisi: string) => {
    switch (kondisi?.toLowerCase()) {
      case 'sehat': return '#4CAF50';
      case 'rusak_ringan': return '#FF9800';
      case 'rusak_berat': return '#F44336';
      case 'mati': return '#9C27B0';
      default: return '#666';
    }
  };

  const getKondisiLabel = (kondisi: string) => {
    switch (kondisi?.toLowerCase()) {
      case 'sehat': return 'Sehat';
      case 'rusak_ringan': return 'Rusak Ringan';
      case 'rusak_berat': return 'Rusak Berat';
      case 'mati': return 'Mati';
      default: return kondisi;
    }
  };

  const getUrgensiColor = (urgensi: string) => {
    switch (urgensi?.toLowerCase()) {
      case 'rendah': return '#4CAF50';
      case 'sedang': return '#FF9800';
      case 'tinggi': return '#F44336';
      case 'kritis': return '#9C27B0';
      default: return '#666';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sistem AI & Keputusan</Text>
        <Text style={styles.subtitle}>
          Analisis AI mangrove dan hasil keputusan pemerintah
        </Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'analisis' && styles.activeTab]}
          onPress={() => setActiveTab('analisis')}
        >
          <Ionicons 
            name="analytics" 
            size={20} 
            color={activeTab === 'analisis' ? '#2196F3' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'analisis' && styles.activeTabText]}>
            Analisis AI
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'keputusan' && styles.activeTab]}
          onPress={() => setActiveTab('keputusan')}
        >
          <Ionicons 
            name="document-text" 
            size={20} 
            color={activeTab === 'keputusan' ? '#2196F3' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'keputusan' && styles.activeTabText]}>
            Hasil Keputusan
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeTab === 'analisis' ? (
          /* TAB ANALISIS AI */
          <View>
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
                    setHasil(null);
                  }}
                  style={styles.picker}
                >
                  <Picker.Item label="-- Pilih laporan dengan foto --" value="" />
                  {laporanList
                    .filter(laporan => laporan.foto)
                    .map((laporan) => (
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
                onPress={handleAnalisis}
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
              </View>
            )}

            {/* Empty States untuk Analisis */}
            {laporanList.filter(l => l.foto).length === 0 && laporanList.length > 0 && !fetchLoading && (
              <View style={styles.emptyState}>
                <Ionicons name="image-outline" size={64} color="#ccc" />
                <Text style={styles.emptyTitle}>Tidak ada laporan dengan foto</Text>
                <Text style={styles.emptySubtitle}>
                  Hanya laporan dengan foto yang bisa dianalisis oleh AI
                </Text>
              </View>
            )}
          </View>
        ) : (
          /* TAB HASIL KEPUTUSAN */
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
                    {/* Header */}
                    <View style={styles.cardHeader}>
                      <View style={styles.laporanInfo}>
                        <Text style={styles.jenisLaporan}>
                          {keputusan.analisis?.laporan?.jenis_laporan || 'Laporan'}
                        </Text>
                        <Text style={styles.lokasi}>
                          {keputusan.analisis?.laporan?.lokasi?.nama_lokasi || 'Lokasi tidak tersedia'}
                        </Text>
                      </View>
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
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    gap: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#2196F3",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  activeTabText: {
    color: "#2196F3",
  },
  content: {
    flex: 1,
    padding: 16,
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
  // Keputusan Styles
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