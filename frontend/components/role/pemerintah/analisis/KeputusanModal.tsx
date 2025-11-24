import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Modal,
  StyleSheet,
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { KeputusanFormData } from '@/components/types/analisis';

interface KeputusanModalProps {
  visible: boolean;
  formData: KeputusanFormData;
  loading: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onFormDataChange: (data: KeputusanFormData) => void;
}

export const KeputusanModal: React.FC<KeputusanModalProps> = ({
  visible,
  formData,
  loading,
  onClose,
  onSubmit,
  onFormDataChange,
}) => {
  const handleFormChange = (field: keyof KeputusanFormData, value: string) => {
    onFormDataChange({
      ...formData,
      [field]: value,
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Buat Keputusan Baru</Text>
          <TouchableOpacity 
            onPress={onClose}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Tindakan yang Diambil *</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={formData.tindakan_yang_diambil}
              onChangeText={(text) => handleFormChange('tindakan_yang_diambil', text)}
              placeholder="Jelaskan tindakan yang akan diambil berdasarkan rekomendasi AI..."
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Anggaran (Rp)</Text>
            <TextInput
              style={styles.textInput}
              value={formData.anggaran}
              onChangeText={(text) => handleFormChange('anggaran', text)}
              placeholder="Contoh: 5000000"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.rowInputs}>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Tanggal Mulai</Text>
              <TextInput
                style={styles.textInput}
                value={formData.tanggal_mulai}
                onChangeText={(text) => handleFormChange('tanggal_mulai', text)}
                placeholder="YYYY-MM-DD"
              />
            </View>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Tanggal Selesai</Text>
              <TextInput
                style={styles.textInput}
                value={formData.tanggal_selesai}
                onChangeText={(text) => handleFormChange('tanggal_selesai', text)}
                placeholder="YYYY-MM-DD"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Catatan Tambahan</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={formData.catatan}
              onChangeText={(text) => handleFormChange('catatan', text)}
              placeholder="Tambahkan catatan jika diperlukan..."
              multiline
              numberOfLines={3}
            />
          </View>
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Batal</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.buttonDisabled]}
            onPress={onSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Simpan Keputusan</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  modalContent: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  rowInputs: {
    flexDirection: "row",
    gap: 12,
  },
  modalFooter: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  submitButton: {
    flex: 2,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#2196F3",
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});