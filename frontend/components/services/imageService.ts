import * as ImagePicker from "expo-image-picker";
import { ImagePickerResult } from '@/components/types/laporan';

export class ImageService {
  static async requestMediaLibraryPermissions(): Promise<boolean> {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting media library permissions:', error);
      return false;
    }
  }

  static async requestCameraPermissions(): Promise<boolean> {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting camera permissions:', error);
      return false;
    }
  }

  static async pickImageFromLibrary(): Promise<ImagePickerResult | null> {
    try {
      const hasPermission = await this.requestMediaLibraryPermissions();
      if (!hasPermission) {
        throw new Error('Izin akses galeri tidak diberikan');
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets.length > 0) {
        return result.assets[0];
      }
      return null;
    } catch (error) {
      console.error('Error picking image from library:', error);
      throw new Error('Gagal memilih foto dari galeri');
    }
  }

  static async takePhoto(): Promise<ImagePickerResult | null> {
    try {
      const hasPermission = await this.requestCameraPermissions();
      if (!hasPermission) {
        throw new Error('Izin akses kamera tidak diberikan');
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets.length > 0) {
        return result.assets[0];
      }
      return null;
    } catch (error) {
      console.error('Error taking photo:', error);
      throw new Error('Gagal mengambil foto');
    }
  }
}