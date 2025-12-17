import { ImageService } from '@/components/services/imageService';
import { FormState, Jenis } from '@/components/types/jenis';
import { JenisServiceCRUD, JenisServicePeneliti } from '@/components/services/peneliti/jenisService';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

// Hook untuk list jenis (view)
export interface UseJenisListPenelitiReturn {
  jenisList: Jenis[];
  loading: boolean;
  error: string | null;
  fetchJenis: () => Promise<void>;
  truncateText: (text: string, maxLength: number) => string;
  formatJenisToFormState: (jenis: Jenis) => FormState;
  createEmptyFormState: () => FormState;
}

export const useJenisListPeneliti = (): UseJenisListPenelitiReturn => {
  const [jenisList, setJenisList] = useState<Jenis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJenis = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const jenisData = await JenisServicePeneliti.fetchJenis();
      setJenisList(jenisData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);
 
  const truncateText = useCallback((text: string, maxLength: number): string => {
    if (!text) return "";
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }, []);

  const formatJenisToFormState = useCallback((jenis: Jenis): FormState => {
    return JenisServicePeneliti.formatJenisToFormState(jenis);
  }, []);

  const createEmptyFormState = useCallback((): FormState => {
    return JenisServicePeneliti.createEmptyFormState();
  }, []);

  return {
    jenisList,
    loading,
    error,
    fetchJenis,
    truncateText,
    formatJenisToFormState,
    createEmptyFormState,
  };
};

// Hook untuk form CRUD operations
type Mode = "create" | "edit";

export interface UseJenisFormPenelitiReturn {
  form: FormState;
  isLoading: boolean;
  imageError: string;
  setForm: (form: FormState) => void;
  setImageError: (error: string) => void;
  handleFieldChange: (field: keyof FormState, value: string) => void;
  handlePickImage: () => Promise<void>;
  handleTakePhoto: () => Promise<void>;
  handleRemoveImage: () => void;
  handleSubmit: (mode: Mode, onSuccess: () => void) => Promise<void>;
  handleDelete: (onSuccess: () => void) => Promise<void>;
  validateForm: () => boolean;
}

export const useJenisFormPeneliti = (initialForm: FormState): UseJenisFormPenelitiReturn => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState("");

  const handleFieldChange = useCallback((field: keyof FormState, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handlePickImage = useCallback(async (): Promise<void> => {
    try {
      const imageAsset = await ImageService.pickImageFromLibrary();
      if (imageAsset) {
        setForm(prev => ({ ...prev, gambar: imageAsset }));
        setImageError("");
      }
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Gagal memilih gambar");
    }
  }, []);

  const handleTakePhoto = useCallback(async (): Promise<void> => {
    try {
      const imageAsset = await ImageService.takePhoto();
      if (imageAsset) {
        setForm(prev => ({ ...prev, gambar: imageAsset }));
        setImageError("");
      }
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Gagal mengambil foto");
    }
  }, []);

  const handleRemoveImage = useCallback((): void => {
    setForm(prev => ({ ...prev, gambar: null }));
  }, []);

  const validateForm = useCallback((): boolean => {
    if (!form.nama_ilmiah.trim()) {
      Alert.alert("Error", "Nama ilmiah wajib diisi");
      return false;
    }

    if (!form.nama_lokal.trim()) {
      Alert.alert("Error", "Nama lokal wajib diisi");
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
      const formData = JenisServiceCRUD.convertToFormData(form);

      if (mode === "edit" && form.jenis_id) {
        await JenisServiceCRUD.updateJenis(form.jenis_id, formData);
        Alert.alert("Sukses", "Jenis mangrove berhasil diperbarui");
      } else {
        await JenisServiceCRUD.createJenis(formData);
        Alert.alert("Sukses", "Jenis mangrove berhasil ditambahkan");
      }
      
      onSuccess();
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Gagal menyimpan data");
    } finally {
      setIsLoading(false);
    }
  }, [form, validateForm]);

  const handleDelete = useCallback(async (onSuccess: () => void): Promise<void> => {
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
            try {
              await JenisServiceCRUD.deleteJenis(form.jenis_id!);
              Alert.alert("Sukses", "Jenis mangrove berhasil dihapus");
              onSuccess();
            } catch (error) {
              Alert.alert("Error", error instanceof Error ? error.message : "Gagal menghapus data");
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  }, [form.jenis_id]);

  return {
    form,
    isLoading,
    imageError,
    setForm,
    setImageError,
    handleFieldChange,
    handlePickImage,
    handleTakePhoto,
    handleRemoveImage,
    handleSubmit,
    handleDelete,
    validateForm,
  };
};