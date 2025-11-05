import { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  Alert, 
  ScrollView, 
  StyleSheet,
  ActivityIndicator,
  Modal,
  FlatList
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "@/components/api/api";

interface Lokasi {
  lokasi_id: number;
  nama_lokasi: string;
}

export default function CreateLaporan() {
  const [selectedLokasi, setSelectedLokasi] = useState<Lokasi | null>(null);
  const [jenis_laporan, setJenisLaporan] = useState("");
  const [isi_laporan, setIsiLaporan] = useState("");
  const [foto, setFoto] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [lokasiList, setLokasiList] = useState<Lokasi[]>([]);
  const [showLokasiModal, setShowLokasiModal] = useState(false);
  const [loadingLokasi, setLoadingLokasi] = useState(false);
  const router = useRouter();

  // Fetch daftar lokasi
  useEffect(() => {
    fetchLokasi();
  }, []);

  const fetchLokasi = async () => {
    try {
      setLoadingLokasi(true);
      const res = await fetch(`${API_URL}/lokasi`);
      
      if (!res.ok) throw new Error("Gagal mengambil data lokasi");
      
      const data = await res.json();
      setLokasiList(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Gagal memuat daftar lokasi");
    } finally {
      setLoadingLokasi(false);
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Izin diperlukan', 'Aplikasi membutuhkan akses galeri untuk memilih foto');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled) {
        setFoto(result.assets[0]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Gagal memilih foto");
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Izin diperlukan', 'Aplikasi membutuhkan akses kamera untuk mengambil foto');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled) {
        setFoto(result.assets[0]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Gagal mengambil foto");
    }
  };

  const handleSubmit = async () => {
    if (!selectedLokasi || !jenis_laporan || !isi_laporan) {
      Alert.alert("Perhatian", "Lokasi, jenis laporan, dan isi laporan wajib diisi");
      return;
    }

    if (isi_laporan.length < 10) {
      Alert.alert("Perhatian", "Isi laporan minimal 10 karakter");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("lokasi_id", selectedLokasi.lokasi_id.toString());
    formData.append("jenis_laporan", jenis_laporan);
    formData.append("isi_laporan", isi_laporan);

    if (foto) {
      const uriParts = foto.uri.split(".");
      const fileType = uriParts[uriParts.length - 1];
      formData.append("foto", {
        uri: foto.uri,
        name: `laporan_${Date.now()}.${fileType}`,
        type: `image/${fileType}`,
      } as any);
    }

    try {
      const res = await fetch(`${API_URL}/laporan`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Gagal kirim laporan");

      Alert.alert(
        "Berhasil", 
        "Laporan berhasil dikirim. Tim peneliti akan memverifikasi laporan Anda.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Terjadi kesalahan saat mengirim laporan");
    } finally {
      setLoading(false);
    }
  };

  const removePhoto = () => {
    setFoto(null);
  };

  const renderLokasiItem = ({ item }: { item: Lokasi }) => (
    <TouchableOpacity
      style={styles.lokasiItem}
      onPress={() => {
        setSelectedLokasi(item);
        setShowLokasiModal(false);
      }}
    >
      <Text style={styles.lokasiName}>{item.nama_lokasi}</Text>
    </TouchableOpacity>
  );

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

        {/* Foto */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Foto Bukti</Text>
          <Text style={styles.helperText}>
            Foto akan membantu tim peneliti memahami kondisi dengan lebih baik (Opsional)
          </Text>
          
          <View style={styles.photoButtons}>
            <TouchableOpacity 
              style={[styles.photoButton, loading && styles.buttonDisabled]}
              onPress={takePhoto}
              disabled={loading}
            >
              <Ionicons name="camera" size={24} color="#4CAF50" />
              <Text style={styles.photoButtonText}>Ambil Foto</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.photoButton, loading && styles.buttonDisabled]}
              onPress={pickImage}
              disabled={loading}
            >
              <Ionicons name="images" size={24} color="#2196F3" />
              <Text style={styles.photoButtonText}>Pilih dari Galeri</Text>
            </TouchableOpacity>
          </View>

          {foto && (
            <View style={styles.photoPreview}>
              <Image
                source={{ uri: foto.uri }}
                style={styles.previewImage}
                resizeMode="cover"
              />
              <TouchableOpacity 
                style={styles.removePhotoButton}
                onPress={removePhoto}
                disabled={loading}
              >
                <Ionicons name="close" size={20} color="white" />
              </TouchableOpacity>
            </View>
          )}
        </View>

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

      {/* Modal Pilih Lokasi */}
      <Modal
        visible={showLokasiModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Pilih Lokasi</Text>
            <TouchableOpacity 
              onPress={() => setShowLokasiModal(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {loadingLokasi ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text style={styles.loadingText}>Memuat daftar lokasi...</Text>
            </View>
          ) : (
            <FlatList
              data={lokasiList}
              renderItem={renderLokasiItem}
              keyExtractor={(item) => item.lokasi_id.toString()}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </Modal>
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
  helperText: {
    fontSize: 13,
    color: "#666",
    marginBottom: 12,
    lineHeight: 18,
  },
  photoButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  photoButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    backgroundColor: "white",
  },
  photoButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  photoPreview: {
    position: "relative",
    marginTop: 8,
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  removePhotoButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
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
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  lokasiItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  lokasiName: {
    fontSize: 16,
    color: "#333",
  },
});