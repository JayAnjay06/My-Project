import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter } from "expo-router";
import { Lokasi, CreateLaporanData, ImagePickerResult } from '@/components/types/laporan';
import { LaporanService1 } from '@/components/services/laporanService';
import { ImageService } from '@/components/services/imageService';

export interface UseCreateLaporanReturn {
  selectedLokasi: Lokasi | null;
  jenis_laporan: string;
  isi_laporan: string;
  foto: ImagePickerResult | null;
  loading: boolean;
  lokasiList: Lokasi[];
  showLokasiModal: boolean;
  loadingLokasi: boolean;
  setSelectedLokasi: (lokasi: Lokasi | null) => void;
  setJenisLaporan: (jenis: string) => void;
  setIsiLaporan: (isi: string) => void;
  setShowLokasiModal: (show: boolean) => void;
  fetchLokasi: () => Promise<void>;
  pickImage: () => Promise<void>;
  takePhoto: () => Promise<void>;
  removePhoto: () => void;
  handleSubmit: () => Promise<void>;
  validateForm: () => boolean;
}

export const useCreateLaporan = (): UseCreateLaporanReturn => {
  const router = useRouter();
  
  const [selectedLokasi, setSelectedLokasi] = useState<Lokasi | null>(null);
  const [jenis_laporan, setJenisLaporan] = useState("");
  const [isi_laporan, setIsiLaporan] = useState("");
  const [foto, setFoto] = useState<ImagePickerResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [lokasiList, setLokasiList] = useState<Lokasi[]>([]);
  const [showLokasiModal, setShowLokasiModal] = useState(false);
  const [loadingLokasi, setLoadingLokasi] = useState(false);

  const fetchLokasi = useCallback(async (): Promise<void> => {
    try {
      setLoadingLokasi(true);
      const lokasiData = await LaporanService1.fetchLokasi();
      setLokasiList(lokasiData);
    } catch (error) {
      console.error('Error in fetchLokasi:', error);
      const errorMessage = error instanceof Error ? error.message : 'Gagal memuat daftar lokasi';
      Alert.alert("Error", errorMessage);
    } finally {
      setLoadingLokasi(false);
    }
  }, []);

  const pickImage = useCallback(async (): Promise<void> => {
    try {
      const imageResult = await ImageService.pickImageFromLibrary();
      if (imageResult) {
        setFoto(imageResult);
      }
    } catch (error) {
      console.error('Error in pickImage:', error);
      const errorMessage = error instanceof Error ? error.message : 'Gagal memilih foto';
      Alert.alert("Error", errorMessage);
    }
  }, []);

  const takePhoto = useCallback(async (): Promise<void> => {
    try {
      const imageResult = await ImageService.takePhoto();
      if (imageResult) {
        setFoto(imageResult);
      }
    } catch (error) {
      console.error('Error in takePhoto:', error);
      const errorMessage = error instanceof Error ? error.message : 'Gagal mengambil foto';
      Alert.alert("Error", errorMessage);
    }
  }, []);

  const removePhoto = useCallback((): void => {
    setFoto(null);
  }, []);

  const validateForm = useCallback((): boolean => {
    if (!selectedLokasi || !jenis_laporan.trim() || !isi_laporan.trim()) {
      Alert.alert("Perhatian", "Lokasi, jenis laporan, dan isi laporan wajib diisi");
      return false;
    }

    if (isi_laporan.trim().length < 10) {
      Alert.alert("Perhatian", "Isi laporan minimal 10 karakter");
      return false;
    }

    if (isi_laporan.trim().length > 500) {
      Alert.alert("Perhatian", "Isi laporan maksimal 500 karakter");
      return false;
    }

    return true;
  }, [selectedLokasi, jenis_laporan, isi_laporan]);

  const handleSubmit = useCallback(async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const laporanData: CreateLaporanData = {
        lokasi_id: selectedLokasi!.lokasi_id,
        jenis_laporan: jenis_laporan.trim(),
        isi_laporan: isi_laporan.trim(),
        foto: foto || undefined,
      };

      await LaporanService1.createLaporan(laporanData);

      Alert.alert(
        "Berhasil", 
        "Laporan berhasil dikirim. Tim peneliti akan memverifikasi laporan Anda.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat mengirim laporan';
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  }, [selectedLokasi, jenis_laporan, isi_laporan, foto, validateForm, router]);

  return {
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
    validateForm,
  };
};