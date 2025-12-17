import { useCallback, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { FormState, Lokasi } from '@/components/types/lokasi';
import { LocationService } from '@/components/services/locationService';
import { LokasiServicePeneliti } from '@/components/services/peneliti/lokasiService';

export interface UseLokasiListReturn {
  lokasiList: Lokasi[];
  loading: boolean;
  error: string | null;
  fetchLokasi: () => Promise<void>;
  formatDate: (dateString: string) => string;
  getStatusColor: (kondisi: string) => string;
  formatLokasiToFormState: (lokasi: Lokasi) => FormState;
  createEmptyFormState: () => FormState;
}

export const useLokasiListPeneliti = (): UseLokasiListReturn => {
  const [lokasiList, setLokasiList] = useState<Lokasi[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLokasi = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const lokasiData = await LokasiServicePeneliti.fetchLokasi();
      setLokasiList(lokasiData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const formatDate = useCallback((dateString: string): string => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return "Tanggal tidak valid";
    }
  }, []);

  const getStatusColor = useCallback((kondisi: string): string => {
    switch (kondisi?.toLowerCase()) {
      case "baik":
        return "#4CAF50";
      case "sedang":
        return "#FF9800";
      case "buruk":
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  }, []);

  const formatLokasiToFormState = useCallback((lokasi: Lokasi): FormState => {
    return LokasiServicePeneliti.formatLokasiToFormState(lokasi);
  }, []);

  const createEmptyFormState = useCallback((): FormState => {
    return LokasiServicePeneliti.createEmptyFormState();
  }, []);

  return {
    lokasiList,
    loading,
    error,
    fetchLokasi,
    formatDate,
    getStatusColor,
    formatLokasiToFormState,
    createEmptyFormState,
  };
};

type Mode = "create" | "edit";

export interface UseLokasiFormReturn {
  form: FormState;
  showDatePicker: boolean;
  isLoading: boolean;
  setForm: (form: FormState) => void;
  setShowDatePicker: (show: boolean) => void;
  handleFieldChange: (field: keyof FormState, value: string | Date | null) => void;
  handleGetCurrentLocation: () => Promise<void>;
  handleDateChange: (event: any, date?: Date) => void;
  handleSubmit: (mode: Mode, onSuccess: () => void) => Promise<void>;
  handleDelete: (onSuccess: () => void) => Promise<void>;
  validateForm: () => boolean;
}

export const useLokasiFormPeneliti = (initialForm: FormState): UseLokasiFormReturn => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFieldChange = useCallback((field: keyof FormState, value: string | Date | null) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleGetCurrentLocation = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      const location = await LocationService.getCurrentLocation();
      const coords = LocationService.formatCoordinates(location.latitude, location.longitude);
      setForm(prev => ({ ...prev, koordinat: coords }));
      Alert.alert("Sukses", "Koordinat berhasil diambil");
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Gagal mengambil lokasi");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDateChange = useCallback((event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (date) {
      setForm(prev => ({ ...prev, tanggal_input: date }));
    }
  }, []);

  const validateForm = useCallback((): boolean => {
    if (!form.nama_lokasi.trim()) {
      Alert.alert("Error", "Nama lokasi wajib diisi");
      return false;
    }

    if (!form.koordinat.trim()) {
      Alert.alert("Error", "Koordinat wajib diisi");
      return false;
    }

    // Validate coordinate format
    const coordRegex = /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/;
    if (!coordRegex.test(form.koordinat.trim())) {
      Alert.alert("Error", "Format koordinat tidak valid. Contoh: -6.123456, 106.123456");
      return false;
    }

    return true;
  }, [form]);

  const handleSubmit = useCallback(async (mode: Mode, onSuccess: () => void): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
     
    try {
      const formData = LokasiServicePeneliti.convertToFormData(form);

      if (mode === "edit" && form.lokasi_id) {
        await LokasiServicePeneliti.updateLokasi(form.lokasi_id, formData);
        Alert.alert("Sukses", "Lokasi berhasil diperbarui");
      } else {
        await LokasiServicePeneliti.createLokasi(formData);
        Alert.alert("Sukses", "Lokasi berhasil dibuat");
      }
      
      onSuccess();
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Gagal menyimpan data");
    } finally {
      setIsLoading(false);
    }
  }, [form, validateForm]);

  const handleDelete = useCallback(async (onSuccess: () => void): Promise<void> => {
    if (!form.lokasi_id) return;

    Alert.alert("Konfirmasi Hapus", "Apakah Anda yakin ingin menghapus lokasi ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          setIsLoading(true);
          try {
            await LokasiServicePeneliti.deleteLokasi(form.lokasi_id!);
            Alert.alert("Sukses", "Lokasi berhasil dihapus");
            onSuccess();
          } catch (error) {
            Alert.alert("Error", error instanceof Error ? error.message : "Gagal menghapus lokasi");
          } finally {
            setIsLoading(false);
          }
        },
      },
    ]);
  }, [form.lokasi_id]);

  return {
    form,
    showDatePicker,
    isLoading,
    setForm,
    setShowDatePicker,
    handleFieldChange,
    handleGetCurrentLocation,
    handleDateChange,
    handleSubmit,
    handleDelete,
    validateForm,
  };
};