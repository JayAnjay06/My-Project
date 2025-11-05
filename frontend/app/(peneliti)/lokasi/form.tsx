import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "@/components/api/api";
import { FormState } from "@/components/types/lokasi";

type Props = {
  initialForm: FormState;
  mode: "create" | "edit";
  onSuccess: () => void;
  onCancel: () => void;
};

export default function LokasiForm({ initialForm, mode, onSuccess, onCancel }: Props) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentLocation = async () => {
    try {
      setIsLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Izin ditolak", "Aplikasi membutuhkan akses lokasi");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const coords = `${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`;
      setForm({ ...form, koordinat: coords });
      Alert.alert("Sukses", "Koordinat berhasil diambil");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Gagal mengambil lokasi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.nama_lokasi || !form.koordinat) {
      Alert.alert("Error", "Nama lokasi dan koordinat wajib diisi");
      return;
    }

    setIsLoading(true);
    const token = await AsyncStorage.getItem("token");
    const payload = {
      nama_lokasi: form.nama_lokasi,
      koordinat: form.koordinat,
      jumlah: form.jumlah ? parseInt(form.jumlah) : null,
      kerapatan: form.kerapatan ? parseFloat(form.kerapatan) : null,
      tinggi_rata2: form.tinggi_rata2 ? parseFloat(form.tinggi_rata2) : null,
      diameter_rata2: form.diameter_rata2 ? parseFloat(form.diameter_rata2) : null,
      kondisi: form.kondisi || null,
      luas_area: form.luas_area ? parseFloat(form.luas_area) : null,
      deskripsi: form.deskripsi || null,
      tanggal_input: form.tanggal_input
        ? form.tanggal_input.toISOString().split("T")[0]
        : null,
    };

    const url =
      mode === "edit" && form.lokasi_id
        ? `${API_URL}/lokasi/${form.lokasi_id}`
        : `${API_URL}/lokasi`;

    try {
      const response = await fetch(url, {
        method: mode === "edit" ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Network error");

      Alert.alert(
        "Sukses", 
        mode === "create" ? "Lokasi berhasil dibuat" : "Lokasi berhasil diperbarui"
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
    if (!form.lokasi_id) return;
    
    Alert.alert("Konfirmasi Hapus", "Apakah Anda yakin ingin menghapus lokasi ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          setIsLoading(true);
          const token = await AsyncStorage.getItem("token");
          try {
            await fetch(`${API_URL}/lokasi/${form.lokasi_id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });
            Alert.alert("Sukses", "Lokasi berhasil dihapus");
            onSuccess();
          } catch (err) {
            console.error(err);
            Alert.alert("Error", "Gagal menghapus lokasi");
          } finally {
            setIsLoading(false);
          }
        },
      },
    ]);
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
          options.error && styles.inputError
        ]}
        placeholder={options.placeholder || `Masukkan ${label.toLowerCase()}`}
        placeholderTextColor="#999"
        keyboardType={options.keyboardType || "default"}
        multiline={options.multiline || false}
        numberOfLines={options.multiline ? 4 : 1}
        editable={!isLoading}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {mode === "create" ? "Tambah Lokasi Baru" : "Edit Lokasi"}
        </Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        {/* Informasi Dasar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informasi Dasar</Text>
          {renderInputField(
            "Nama Lokasi",
            form.nama_lokasi,
            (text) => setForm({ ...form, nama_lokasi: text }),
            { required: true }
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Koordinat
              <Text style={styles.required}> *</Text>
            </Text>
            <View style={styles.coordinateContainer}>
              <TextInput
                value={form.koordinat}
                onChangeText={(text) => setForm({ ...form, koordinat: text })}
                style={[styles.input, styles.coordinateInput]}
                placeholder="Contoh: -6.123456, 106.123456"
                placeholderTextColor="#999"
                editable={!isLoading}
              />
              <TouchableOpacity
                style={[styles.locationButton, isLoading && styles.buttonDisabled]}
                onPress={getCurrentLocation}
                disabled={isLoading}
              >
                <Ionicons name="location" size={20} color="#fff" />
                <Text style={styles.locationButtonText}>Lokasi</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tanggal Input</Text>
            <TouchableOpacity
              style={styles.datePicker}
              onPress={() => setShowDatePicker(true)}
              disabled={isLoading}
            >
              <Ionicons name="calendar" size={20} color="#666" />
              <Text style={styles.dateText}>
                {form.tanggal_input
                  ? form.tanggal_input.toLocaleDateString('id-ID')
                  : "Pilih tanggal"}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={form.tanggal_input || new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, date) => {
                  setShowDatePicker(Platform.OS === "ios");
                  if (date) setForm({ ...form, tanggal_input: date });
                }}
              />
            )}
          </View>
        </View>

        {/* Data Pohon */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Pohon</Text>
          <View style={styles.row}>
            {renderInputField(
              "Jumlah Pohon",
              form.jumlah,
              (text) => setForm({ ...form, jumlah: text }),
              { keyboardType: "numeric", placeholder: "0" }
            )}
            {renderInputField(
              "Kerapatan",
              form.kerapatan,
              (text) => setForm({ ...form, kerapatan: text }),
              { keyboardType: "numeric", placeholder: "0" }
            )}
          </View>

          <View style={styles.row}>
            {renderInputField(
              "Tinggi Rata-rata (m)",
              form.tinggi_rata2,
              (text) => setForm({ ...form, tinggi_rata2: text }),
              { keyboardType: "numeric", placeholder: "0.00" }
            )}
            {renderInputField(
              "Diameter Rata-rata (cm)",
              form.diameter_rata2,
              (text) => setForm({ ...form, diameter_rata2: text }),
              { keyboardType: "numeric", placeholder: "0.00" }
            )}
          </View>
        </View>

        {/* Informasi Tambahan */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informasi Tambahan</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Kondisi</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={form.kondisi}
                onValueChange={(value) => setForm({ ...form, kondisi: value })}
                style={styles.picker}
                enabled={!isLoading}
              >
                <Picker.Item label="Pilih kondisi..." value="" />
                <Picker.Item label="Baik" value="baik" />
                <Picker.Item label="Sedang" value="sedang" />
                <Picker.Item label="Buruk" value="buruk" />
              </Picker>
            </View>
          </View>

          {renderInputField(
            "Luas Area (ha)",
            form.luas_area,
            (text) => setForm({ ...form, luas_area: text }),
            { keyboardType: "numeric", placeholder: "0.00" }
          )}

          {renderInputField(
            "Deskripsi",
            form.deskripsi,
            (text) => setForm({ ...form, deskripsi: text }),
            { multiline: true, placeholder: "Tambahkan deskripsi lokasi..." }
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
              <Text style={styles.submitButtonText}>Menyimpan...</Text>
            ) : (
              <Text style={styles.submitButtonText}>
                {mode === "create" ? "Simpan Lokasi" : "Update Lokasi"}
              </Text>
            )}
          </TouchableOpacity>

          {mode === "edit" && form.lokasi_id && (
            <TouchableOpacity
              style={[styles.deleteButton, isLoading && styles.buttonDisabled]}
              onPress={handleDelete}
              disabled={isLoading}
            >
              <Ionicons name="trash" size={20} color="#fff" />
              <Text style={styles.deleteButtonText}>Hapus Lokasi</Text>
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
    </View>
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
  inputError: {
    borderColor: "#F44336",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  coordinateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  coordinateInput: {
    flex: 1,
    marginRight: 8,
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 80,
    justifyContent: "center",
  },
  locationButtonText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 4,
  },
  datePicker: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fafafa",
  },
  dateText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fafafa",
    overflow: "hidden",
  },
  picker: {
    height: 50,
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