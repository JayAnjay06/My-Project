import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { FormState } from '@/components/types/lokasi';
import { useLokasiFormPeneliti } from '@/components/hooks/peneliti/useLokasi';
import DateTimePicker from "@react-native-community/datetimepicker";
import { FormInputField } from '@/components/role/peneliti/lokasi/FormInputField';
import { CoordinateInput } from '@/components/role/peneliti/lokasi/CoordinateInput';

type Props = {
  initialForm: FormState;
  mode: "create" | "edit";
  onSuccess: () => void;
  onCancel: () => void;
};

export default function LokasiForm({ initialForm, mode, onSuccess, onCancel }: Props) {
  const {
    form,
    showDatePicker,
    isLoading,
    setShowDatePicker,
    handleFieldChange,
    handleGetCurrentLocation,
    handleDateChange,
    handleSubmit,
    handleDelete,
  } = useLokasiFormPeneliti(initialForm);

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

          <FormInputField
            label="Nama Lokasi"
            value={form.nama_lokasi}
            onChangeText={(text) => handleFieldChange('nama_lokasi', text)}
            required
            placeholder="Masukkan nama lokasi"
            editable={!isLoading}
          />

          <CoordinateInput
            label="Koordinat"
            value={form.koordinat}
            onCoordinateChange={(text) => handleFieldChange('koordinat', text)}
            onGetLocation={handleGetCurrentLocation}
            required
            isLoading={isLoading}
            editable={!isLoading}
          />

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
                onChange={handleDateChange}
              />
            )}
          </View>
        </View>

        {/* Data Pohon */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Pohon</Text>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <FormInputField
                label="Jumlah Pohon"
                value={form.jumlah}
                onChangeText={(text) => handleFieldChange('jumlah', text)}
                keyboardType="numeric"
                placeholder="0"
                editable={!isLoading}
              />
            </View>
            <View style={styles.halfInput}>
              <FormInputField
                label="Kerapatan"
                value={form.kerapatan}
                onChangeText={(text) => handleFieldChange('kerapatan', text)}
                keyboardType="numeric"
                placeholder="0"
                editable={!isLoading}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <FormInputField
                label="Tinggi Rata-rata (m)"
                value={form.tinggi_rata2}
                onChangeText={(text) => handleFieldChange('tinggi_rata2', text)}
                keyboardType="numeric"
                placeholder="0.00"
                editable={!isLoading}
              />
            </View>
            <View style={styles.halfInput}>
              <FormInputField
                label="Diameter Rata-rata (cm)"
                value={form.diameter_rata2}
                onChangeText={(text) => handleFieldChange('diameter_rata2', text)}
                keyboardType="numeric"
                placeholder="0.00"
                editable={!isLoading}
              />
            </View>
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
                onValueChange={(value) => handleFieldChange('kondisi', value)}
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

          <FormInputField
            label="Luas Area (ha)"
            value={form.luas_area}
            onChangeText={(text) => handleFieldChange('luas_area', text)}
            keyboardType="numeric"
            placeholder="0.00"
            editable={!isLoading}
          />

          <FormInputField
            label="Deskripsi"
            value={form.deskripsi}
            onChangeText={(text) => handleFieldChange('deskripsi', text)}
            multiline
            numberOfLines={4}
            placeholder="Tambahkan deskripsi lokasi..."
            editable={!isLoading}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.buttonDisabled]}
            onPress={() => handleSubmit(mode, onSuccess)}
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
              onPress={() => handleDelete(onSuccess)}
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
    marginHorizontal: -4,
  },
  halfInput: {
    flex: 1,
    marginHorizontal: 4,
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