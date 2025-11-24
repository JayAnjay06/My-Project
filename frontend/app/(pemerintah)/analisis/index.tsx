import React from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet,
  RefreshControl,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AnalisisTab } from '@/components/role/pemerintah/analisis/AnalisisTab';
import { KeputusanTab } from '@/components/role/pemerintah/analisis/KeputusanTab';
import { KeputusanModal } from '@/components/role/pemerintah/analisis/KeputusanModal';
import { useAnalisisKeputusan } from "@/components/hooks/useAnalisisKeputusan";

export default function AnalisisDanKeputusan() {
  const {
    // State dari analisis
    laporanList,
    selectedLaporan,
    loading,
    fetchLoading,
    refreshing,
    hasil,
    stats,

    // State dari keputusan
    keputusanList,
    showKeputusanModal,
    keputusanLoading,
    hapusLoading,
    formData,

    // Setters
    setSelectedLaporan,
    setShowKeputusanModal,
    setFormData,

    // Actions
    onRefresh,
    handleAnalisis,
    handleBuatKeputusan,
    submitKeputusan,
    handleHapusKeputusan,

    // Helpers
    getSelectedLaporanData,
    truncateText,
    formatDate,
    formatCurrency,
    getConfidenceColor,
    getKondisiColor,
    getKondisiLabel,
    getUrgensiColor,
    getStatusColor,
    getStatusLabel,
  } = useAnalisisKeputusan();

  // State untuk active tab
  const [activeTab, setActiveTab] = React.useState<'analisis' | 'keputusan'>('analisis');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sistem AI & Keputusan</Text>
        <Text style={styles.subtitle}>
          Analisis AI mangrove dan pengambilan keputusan
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
          <AnalisisTab
            laporanList={laporanList}
            selectedLaporan={selectedLaporan}
            setSelectedLaporan={setSelectedLaporan}
            loading={loading}
            fetchLoading={fetchLoading}
            hasil={hasil}
            stats={stats}
            onAnalisis={handleAnalisis}
            onBuatKeputusan={handleBuatKeputusan}
            getSelectedLaporanData={getSelectedLaporanData}
            truncateText={truncateText}
            formatDate={formatDate}
            getConfidenceColor={getConfidenceColor}
            getKondisiColor={getKondisiColor}
            getKondisiLabel={getKondisiLabel}
            getUrgensiColor={getUrgensiColor}
          />
        ) : (
          <KeputusanTab
            keputusanList={keputusanList}
            hapusLoading={hapusLoading}
            onHapusKeputusan={handleHapusKeputusan}
            formatDate={formatDate}
            formatCurrency={formatCurrency}
            truncateText={truncateText}
            getStatusColor={getStatusColor}
            getStatusLabel={getStatusLabel}
          />
        )}
      </ScrollView>

      {/* Modal Buat Keputusan */}
      <KeputusanModal
        visible={showKeputusanModal}
        formData={formData}
        loading={keputusanLoading}
        onClose={() => setShowKeputusanModal(false)}
        onSubmit={submitKeputusan}
        onFormDataChange={setFormData}
      />
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
});