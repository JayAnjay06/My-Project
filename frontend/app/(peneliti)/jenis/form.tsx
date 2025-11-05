import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "@/components/api/api";
import { FormState } from "@/components/types/jenis";

type Props = {
  initialForm: FormState;
  mode: "create" | "edit";
  onSuccess: () => void;
  onCancel: () => void;
};

export default function JenisForm({ initialForm, mode, onSuccess, onCancel }: Props) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState("");

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Izin diperlukan", "Aplikasi membutuhkan akses galeri untuk memilih gambar");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setForm({ ...form, gambar: result.assets[0] });
        setImageError("");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Gagal memilih gambar");
    }
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Izin diperlukan", "Aplikasi membutuhkan akses kamera untuk mengambil foto");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setForm({ ...form, gambar: result.assets[0] });
        setImageError("");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Gagal mengambil foto");
    }
  };

  const handleSubmit = async () => {
    if (!form.nama_ilmiah || !form.nama_lokal) {
      Alert.alert("Error", "Nama ilmiah dan nama lokal wajib diisi");
      return;
    }

    setIsLoading(true);
    const token = await AsyncStorage.getItem("token");
    const formData = new FormData();
    
    formData.append("nama_ilmiah", form.nama_ilmiah);
    formData.append("nama_lokal", form.nama_lokal);
    formData.append("deskripsi", form.deskripsi || "");

    if (form.gambar && form.gambar.uri) {
      formData.append("gambar", {
        uri: form.gambar.uri,
        name: `mangrove_${Date.now()}.jpg`,
        type: "image/jpeg",
      } as any);
    }

    const url =
      mode === "edit" && form.jenis_id
        ? `${API_URL}/jenis/${form.jenis_id}`
        : `${API_URL}/jenis`;

    if (mode === "edit") {
      formData.append("_method", "PUT");
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Network error");

      Alert.alert(
        "Sukses", 
        mode === "create" ? "Jenis mangrove berhasil ditambahkan" : "Jenis mangrove berhasil diperbarui"
      );
      onSuccess();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Gagal menyimpan data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!form.jenis_id) return;
    
    Alert.alert(
      "Konfirmasi Hapus", 
      "Apakah Anda yakin ingin menghapus jenis mangrove ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            const token = await AsyncStorage.getItem("token");
            try {
              await fetch(`${API_URL}/jenis/${form.jenis_id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              });
              Alert.alert("Sukses", "Jenis mangrove berhasil dihapus");
              onSuccess();
            } catch (err) {
              console.error(err);
              Alert.alert("Error", "Gagal menghapus data");
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const renderInputField = (
    label: string,
    value: string,
    onChange: (text: string) => void,
    options: any = {}
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>
        {label}
        {options.required && <Text style={styles.required}> *</Text>}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        style={[
          styles.input,
          options.multiline && styles.textArea,
        ]}
        placeholder={options.placeholder || `Masukkan ${label.toLowerCase()}`}
        placeholderTextColor="#999"
        multiline={options.multiline || false}
        numberOfLines={options.multiline ? 4 : 1}
        editable={!isLoading}
        returnKeyType={options.multiline ? "default" : "done"}
        blurOnSubmit={!options.multiline}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {mode === "create" ? "Tambah Jenis Mangrove" : "Edit Jenis Mangrove"}
        </Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView 
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        {/* Informasi Dasar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informasi Dasar</Text>
          
          {renderInputField(
            "Nama Ilmiah",
            form.nama_ilmiah,
            (text) => setForm({ ...form, nama_ilmiah: text }),
            { 
              required: true,
              placeholder: "Contoh: Rhizophora mucronata"
            }
          )}

          {renderInputField(
            "Nama Lokal",
            form.nama_lokal,
            (text) => setForm({ ...form, nama_lokal: text }),
            { 
              required: true,
              placeholder: "Contoh: Bakau Kurap"
            }
          )}
        </View>

        {/* Gambar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gambar</Text>
          
          <View style={styles.imageButtonsContainer}>
            <TouchableOpacity 
              style={[styles.imageButton, isLoading && styles.buttonDisabled]}
              onPress={handlePickImage}
              disabled={isLoading}
            >
              <Ionicons name="image" size={20} color="#2196F3" />
              <Text style={styles.imageButtonText}>Pilih dari Galeri</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.imageButton, isLoading && styles.buttonDisabled]}
              onPress={handleTakePhoto}
              disabled={isLoading}
            >
              <Ionicons name="camera" size={20} color="#4CAF50" />
              <Text style={styles.imageButtonText}>Ambil Foto</Text>
            </TouchableOpacity>
          </View>

          {form.gambar && (
            <View style={styles.imagePreviewContainer}>
              <Image
                source={{ uri: form.gambar.uri }}
                style={styles.imagePreview}
                resizeMode="cover"
              />
              <TouchableOpacity 
                style={styles.removeImageButton}
                onPress={() => setForm({ ...form, gambar: null })}
                disabled={isLoading}
              >
                <Ionicons name="close" size={20} color="white" />
              </TouchableOpacity>
            </View>
          )}

          {imageError ? (
            <Text style={styles.errorText}>{imageError}</Text>
          ) : (
            <Text style={styles.helperText}>
              Pilih gambar yang jelas untuk identifikasi jenis mangrove
            </Text>
          )}
        </View>

        {/* Deskripsi */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deskripsi</Text>
          
          {renderInputField(
            "Deskripsi Lengkap",
            form.deskripsi,
            (text) => setForm({ ...form, deskripsi: text }),
            { 
              multiline: true,
              placeholder: "Tambahkan deskripsi lengkap tentang karakteristik, habitat, dan ciri-ciri khusus jenis mangrove ini..."
            }
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>
                {mode === "create" ? "Simpan Jenis" : "Update Jenis"}
              </Text>
            )}
          </TouchableOpacity>

          {mode === "edit" && form.jenis_id && (
            <TouchableOpacity
              style={[styles.deleteButton, isLoading && styles.buttonDisabled]}
              onPress={handleDelete}
              disabled={isLoading}
            >
              <Ionicons name="trash" size={20} color="#fff" />
              <Text style={styles.deleteButtonText}>Hapus Jenis</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onCancel}
            disabled={isLoading}
          >
            <Text style={styles.cancelButtonText}>Batal</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  formContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30, // Extra padding untuk memastikan tombol tidak tertutup keyboard
  },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
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
    color: "#2196F3",
    marginBottom: 16,
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
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  imageButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  imageButton: {
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
  imageButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  imagePreviewContainer: {
    position: "relative",
    marginBottom: 8,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  removeImageButton: {
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
  helperText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
  errorText: {
    fontSize: 12,
    color: "#F44336",
    marginTop: 4,
  },
  buttonContainer: {
    marginBottom: 30,
  },
  submitButton: {
    backgroundColor: "#2196F3",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#F44336",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
  },
  deleteButtonText: {
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