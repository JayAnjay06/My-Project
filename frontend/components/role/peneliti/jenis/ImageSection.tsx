import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { ImagePickerAsset } from '@/components/types/jenis';

interface ImageSectionProps {
  gambar: ImagePickerAsset | null;
  isLoading: boolean;
  error: string;
  onPickImage: () => void;
  onTakePhoto: () => void;
  onRemoveImage: () => void;
}

export const ImageSection: React.FC<ImageSectionProps> = ({
  gambar,
  isLoading,
  error,
  onPickImage,
  onTakePhoto,
  onRemoveImage,
}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Gambar</Text>
      
      <View style={styles.imageButtonsContainer}>
        <TouchableOpacity 
          style={[styles.imageButton, isLoading && styles.buttonDisabled]}
          onPress={onPickImage}
          disabled={isLoading}
        >
          <Ionicons name="image" size={20} color="#2196F3" />
          <Text style={styles.imageButtonText}>Pilih dari Galeri</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.imageButton, isLoading && styles.buttonDisabled]}
          onPress={onTakePhoto}
          disabled={isLoading}
        >
          <Ionicons name="camera" size={20} color="#4CAF50" />
          <Text style={styles.imageButtonText}>Ambil Foto</Text>
        </TouchableOpacity>
      </View>

      {gambar && (
        <View style={styles.imagePreviewContainer}>
          <Image
            source={{ uri: gambar.uri }}
            style={styles.imagePreview}
            resizeMode="cover"
          />
          <TouchableOpacity 
            style={styles.removeImageButton}
            onPress={onRemoveImage}
            disabled={isLoading}
          >
            <Ionicons name="close" size={20} color="white" />
          </TouchableOpacity>
        </View>
      )}

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <Text style={styles.helperText}>
          Pilih gambar yang jelas untuk identifikasi jenis mangrove
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  buttonDisabled: {
    opacity: 0.6,
  },
});