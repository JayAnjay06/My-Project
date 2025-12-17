import { FormInputField } from '@/components/role/peneliti/jenis/FormInputField';
import { ImageSection } from '@/components/role/peneliti/jenis/ImageSection';
import { FormState } from '@/components/types/jenis';
import { useJenisFormPeneliti } from '@/components/hooks/peneliti/useJenis';
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  initialForm: FormState;
  mode: "create" | "edit";
  onSuccess: () => void;
  onCancel: () => void;
};

export default function JenisForm({ initialForm, mode, onSuccess, onCancel }: Props) {
  const {
    form,
    isLoading,
    imageError,
    handleFieldChange,
    handlePickImage,
    handleTakePhoto,
    handleRemoveImage,
    handleSubmit,
    handleDelete,
  } = useJenisFormPeneliti(initialForm);

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
          
          <FormInputField
            label="Nama Ilmiah"
            value={form.nama_ilmiah}
            onChangeText={(text) => handleFieldChange('nama_ilmiah', text)}
            required
            placeholder="Contoh: Rhizophora mucronata"
            editable={!isLoading}
          />

          <FormInputField
            label="Nama Lokal"
            value={form.nama_lokal}
            onChangeText={(text) => handleFieldChange('nama_lokal', text)}
            required
            placeholder="Contoh: Bakau Kurap"
            editable={!isLoading}
          />
        </View>

        {/* Gambar Section */}
        <ImageSection
          gambar={form.gambar}
          isLoading={isLoading}
          error={imageError}
          onPickImage={handlePickImage}
          onTakePhoto={handleTakePhoto}
          onRemoveImage={handleRemoveImage}
        />

        {/* Deskripsi */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deskripsi</Text>
          
          <FormInputField
            label="Deskripsi Lengkap"
            value={form.deskripsi}
            onChangeText={(text) => handleFieldChange('deskripsi', text)}
            multiline
            numberOfLines={4}
            placeholder="Tambahkan deskripsi lengkap tentang karakteristik, habitat, dan ciri-ciri khusus jenis mangrove ini..."
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
              onPress={() => handleDelete(onSuccess)}
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
    paddingBottom: 30,
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