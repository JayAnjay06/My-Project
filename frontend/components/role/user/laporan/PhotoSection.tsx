import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { ImagePickerResult } from '@/components/types/laporan';

interface PhotoSectionProps {
  foto: ImagePickerResult | null;
  loading: boolean;
  onTakePhoto: () => void;
  onPickImage: () => void;
  onRemovePhoto: () => void;
}

export const PhotoSection: React.FC<PhotoSectionProps> = ({
  foto,
  loading,
  onTakePhoto,
  onPickImage,
  onRemovePhoto,
}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Foto Bukti</Text>
      <Text style={styles.helperText}>
        Foto akan membantu tim peneliti memahami kondisi dengan lebih baik (Opsional)
      </Text>
      
      <View style={styles.photoButtons}>
        <TouchableOpacity 
          style={[styles.photoButton, loading && styles.buttonDisabled]}
          onPress={onTakePhoto}
          disabled={loading}
        >
          <Ionicons name="camera" size={24} color="#4CAF50" />
          <Text style={styles.photoButtonText}>Ambil Foto</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.photoButton, loading && styles.buttonDisabled]}
          onPress={onPickImage}
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
            onPress={onRemovePhoto}
            disabled={loading}
          >
            <Ionicons name="close" size={20} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  buttonDisabled: {
    opacity: 0.6,
  },
});