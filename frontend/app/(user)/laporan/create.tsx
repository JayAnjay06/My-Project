import React, { useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet,
  ActivityIndicator
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCreateLaporan } from '@/components/hooks/useCreateLaporan';
import { LokasiModal } from '@/components/role/user/laporan/LokasiModal';
import { PhotoSection } from '@/components/role/user/laporan/PhotoSection';

export default function CreateLaporan() {
  const router = useRouter();
  const {
    selectedLokasi,
    jenis_laporan,
    isi_laporan,
    foto,
    loading,
    lokasiList,
    showLokasiModal,
    loadingLokasi,
    setSelectedLokasi,
    setJenisLaporan,
    setIsiLaporan,
    setShowLokasiModal,
    fetchLokasi,
    pickImage,
    takePhoto,
    removePhoto,
    handleSubmit,
  } = useCreateLaporan();

  useEffect(() => {
    fetchLokasi();
  }, [fetchLokasi]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buat Laporan Baru</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        {/* Informasi Dasar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informasi Laporan</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Pilih Lokasi <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity 
              style={styles.lokasiSelector}
              onPress={() => setShowLokasiModal(true)}
              disabled={loading}
            >
              <Text style={selectedLokasi ? styles.lokasiSelectedText : styles.lokasiPlaceholder}>
                {selectedLokasi ? selectedLokasi.nama_lokasi : "Pilih lokasi mangrove..."}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Jenis Laporan <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              value={jenis_laporan}
              onChangeText={setJenisLaporan}
              style={styles.input}
              placeholder="Contoh: Kerusakan, Pencemaran, Penanaman, Pemantauan..."
              placeholderTextColor="#999"
              editable={!loading}
            />
          </View>
        </View>

        {/* Isi Laporan */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detail Laporan</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Isi Laporan <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              value={isi_laporan}
              onChangeText={setIsiLaporan}
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={6}
              placeholder="Jelaskan secara detail apa yang terjadi di lokasi mangrove..."
              placeholderTextColor="#999"
              editable={!loading}
              textAlignVertical="top"
              maxLength={500}
            />
            <Text style={styles.charCount}>
              {isi_laporan.length}/500 karakter
            </Text>
          </View>
        </View>

        {/* Foto Section */}
        <PhotoSection
          foto={foto}
          loading={loading}
          onTakePhoto={takePhoto}
          onPickImage={pickImage}
          onRemovePhoto={removePhoto}
        />

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <Ionicons name="send" size={20} color="white" />
                <Text style={styles.submitButtonText}>Kirim Laporan</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Batal</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Lokasi Modal */}
      <LokasiModal
        visible={showLokasiModal}
        lokasiList={lokasiList}
        loading={loadingLokasi}
        onClose={() => setShowLokasiModal(false)}
        onSelectLokasi={setSelectedLokasi}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    padding: 4,
    width: 32,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  formContainer: {
    flex: 1,
    padding: 16,
  },
  section: {
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 12,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  required: {
    color: "#F44336",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  lokasiSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fafafa",
  },
  lokasiSelectedText: {
    fontSize: 16,
    color: "#333",
  },
  lokasiPlaceholder: {
    fontSize: 16,
    color: "#999",
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
    marginTop: 4,
  },
  buttonContainer: {
    marginBottom: 30,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  cancelButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "white",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});