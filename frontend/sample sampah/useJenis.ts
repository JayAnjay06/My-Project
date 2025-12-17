// import { FormState, Jenis, JenisStats } from '@/components/types/jenis';
// import { JenisService, JenisServiceP2, JenisServiceP21 } from '@/sample sampah/jenisService';
// import { useCallback, useEffect, useState } from 'react';
// import { Alert } from 'react-native';
// import { ImageService } from '../services/imageService';

// export interface UseJenisReturn {
//   jenisList: Jenis[];
//   loading: boolean;
//   refreshing: boolean;
//   error: string | null;
//   expandedId: number | null;
//   fetchJenis: () => Promise<void>;
//   onRefresh: () => void;
//   toggleExpand: (id: number) => void;
//   truncateText: (text: string, maxLength: number) => string;
// }

// export const useJenis = (): UseJenisReturn => {
//   const [jenisList, setJenisList] = useState<Jenis[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [expandedId, setExpandedId] = useState<number | null>(null);

//   const fetchJenis = useCallback(async (): Promise<void> => {
//     try {
//       setError(null);
//       const jenisData = await JenisService.fetchJenis();
//       setJenisList(jenisData);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data';
//       setError(errorMessage);
//       console.error('Error in fetchJenis:', err);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, []);

//   const onRefresh = useCallback((): void => {
//     setRefreshing(true);
//     fetchJenis();
//   }, [fetchJenis]);

//   const toggleExpand = useCallback((id: number): void => {
//     setExpandedId(prevId => prevId === id ? null : id);
//   }, []);

//   const truncateText = useCallback((text: string, maxLength: number): string => {
//     if (!text) return "Tidak ada deskripsi";
//     if (text.length > maxLength) {
//       return text.substring(0, maxLength) + '...';
//     }
//     return text;
//   }, []);

//   return {
//     jenisList,
//     loading,
//     refreshing,
//     error,
//     expandedId,
//     fetchJenis,
//     onRefresh,
//     toggleExpand,
//     truncateText,
//   };
// };

// // pemerintah
// export interface UseJenisMonitoringReturn {
//   jenisList: Jenis[];
//   loading: boolean;
//   refreshing: boolean;
//   error: string | null;
//   stats: JenisStats;
//   fetchJenis: () => Promise<void>;
//   onRefresh: () => void;
//   truncateText: (text: string, maxLength: number) => string;
// }

// export const useJenisMonitoring = (): UseJenisMonitoringReturn => {
//   const [jenisList, setJenisList] = useState<Jenis[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const stats: JenisStats = {
//     totalJenis: jenisList.length,
//   };

//   const fetchJenis = useCallback(async (): Promise<void> => {
//     try {
//       setError(null);
//       const jenisData = await JenisService.fetchJenis();
//       setJenisList(jenisData);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data';
//       setError(errorMessage);
//       console.error('Error in fetchJenis:', err);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, []);

//   const onRefresh = useCallback((): void => {
//     setRefreshing(true);
//     fetchJenis();
//   }, [fetchJenis]);

//   const truncateText = useCallback((text: string, maxLength: number): string => {
//     if (!text) return "-";
//     if (text.length > maxLength) {
//       return text.substring(0, maxLength) + '...';
//     }
//     return text;
//   }, []);

//   useEffect(() => {
//     fetchJenis();
//   }, [fetchJenis]);

//   return {
//     jenisList,
//     loading,
//     refreshing,
//     error,
//     stats,
//     fetchJenis,
//     onRefresh,
//     truncateText,
//   };
// };
 

// //peneliti
// export interface UseJenisListReturn {
//   jenisList: Jenis[];
//   loading: boolean;
//   error: string | null;
//   fetchJenis: () => Promise<void>;
//   truncateText: (text: string, maxLength: number) => string;
//   formatJenisToFormState: (jenis: Jenis) => FormState;
//   createEmptyFormState: () => FormState;
// }

// export const useJenisList = (): UseJenisListReturn => {
//   const [jenisList, setJenisList] = useState<Jenis[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchJenis = useCallback(async (): Promise<void> => {
//     try {
//       setLoading(true);
//       setError(null);
//       const jenisData = await JenisService.fetchJenis();
//       setJenisList(jenisData);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data';
//       setError(errorMessage);
//       console.error('Error in fetchJenis:', err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const truncateText = useCallback((text: string, maxLength: number): string => {
//     if (!text) return "";
//     if (text.length > maxLength) {
//       return text.substring(0, maxLength) + '...';
//     }
//     return text;
//   }, []);

//   const formatJenisToFormState = useCallback((jenis: Jenis): FormState => {
//     return JenisServiceP2.formatJenisToFormState(jenis);
//   }, []);

//   const createEmptyFormState = useCallback((): FormState => {
//     return JenisServiceP2.createEmptyFormState();
//   }, []);

//   return {
//     jenisList,
//     loading,
//     error,
//     fetchJenis,
//     truncateText,
//     formatJenisToFormState,
//     createEmptyFormState,
//   };
// };

// //
// type Mode = "create" | "edit";

// export interface UseJenisFormReturn {
//   form: FormState;
//   isLoading: boolean;
//   imageError: string;
//   setForm: (form: FormState) => void;
//   setImageError: (error: string) => void;
//   handleFieldChange: (field: keyof FormState, value: string) => void;
//   handlePickImage: () => Promise<void>;
//   handleTakePhoto: () => Promise<void>;
//   handleRemoveImage: () => void;
//   handleSubmit: (mode: Mode, onSuccess: () => void) => Promise<void>;
//   handleDelete: (onSuccess: () => void) => Promise<void>;
//   validateForm: () => boolean;
// }

// export const useJenisForm = (initialForm: FormState): UseJenisFormReturn => {
//   const [form, setForm] = useState<FormState>(initialForm);
//   const [isLoading, setIsLoading] = useState(false);
//   const [imageError, setImageError] = useState("");

//   const handleFieldChange = useCallback((field: keyof FormState, value: string) => {
//     setForm(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   }, []);

//   const handlePickImage = useCallback(async (): Promise<void> => {
//     try {
//       const imageAsset = await ImageService.pickImageFromLibrary();
//       if (imageAsset) {
//         setForm(prev => ({ ...prev, gambar: imageAsset }));
//         setImageError("");
//       }
//     } catch (error) {
//       console.error('Error picking image:', error);
//       Alert.alert("Error", error instanceof Error ? error.message : "Gagal memilih gambar");
//     }
//   }, []);

//   const handleTakePhoto = useCallback(async (): Promise<void> => {
//     try {
//       const imageAsset = await ImageService.takePhoto();
//       if (imageAsset) {
//         setForm(prev => ({ ...prev, gambar: imageAsset }));
//         setImageError("");
//       }
//     } catch (error) {
//       console.error('Error taking photo:', error);
//       Alert.alert("Error", error instanceof Error ? error.message : "Gagal mengambil foto");
//     }
//   }, []);

//   const handleRemoveImage = useCallback((): void => {
//     setForm(prev => ({ ...prev, gambar: null }));
//   }, []);

//   const validateForm = useCallback((): boolean => {
//     if (!form.nama_ilmiah.trim()) {
//       Alert.alert("Error", "Nama ilmiah wajib diisi");
//       return false;
//     }

//     if (!form.nama_lokal.trim()) {
//       Alert.alert("Error", "Nama lokal wajib diisi");
//       return false;
//     }

//     // Optional: Validate image if required
//     // if (!form.gambar && mode === 'create') {
//     //   setImageError("Gambar wajib diunggah");
//     //   return false;
//     // }

//     return true;
//   }, [form]);

//   const handleSubmit = useCallback(async (mode: Mode, onSuccess: () => void): Promise<void> => {
//     if (!validateForm()) {
//       return;
//     }

//     setIsLoading(true);
    
//     try {
//       const formData = JenisServiceP21.convertToFormData(form);

//       if (mode === "edit" && form.jenis_id) {
//         await JenisServiceP21.updateJenis(form.jenis_id, formData);
//         Alert.alert("Sukses", "Jenis mangrove berhasil diperbarui");
//       } else {
//         await JenisServiceP21.createJenis(formData);
//         Alert.alert("Sukses", "Jenis mangrove berhasil ditambahkan");
//       }
      
//       onSuccess();
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       Alert.alert("Error", error instanceof Error ? error.message : "Gagal menyimpan data");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [form, validateForm]);

//   const handleDelete = useCallback(async (onSuccess: () => void): Promise<void> => {
//     if (!form.jenis_id) return;

//     Alert.alert(
//       "Konfirmasi Hapus", 
//       "Apakah Anda yakin ingin menghapus jenis mangrove ini?",
//       [
//         { text: "Batal", style: "cancel" },
//         {
//           text: "Hapus",
//           style: "destructive",
//           onPress: async () => {
//             setIsLoading(true);
//             try {
//               await JenisServiceP21.deleteJenis(form.jenis_id!);
//               Alert.alert("Sukses", "Jenis mangrove berhasil dihapus");
//               onSuccess();
//             } catch (error) {
//               console.error('Error deleting jenis:', error);
//               Alert.alert("Error", error instanceof Error ? error.message : "Gagal menghapus data");
//             } finally {
//               setIsLoading(false);
//             }
//           },
//         },
//       ]
//     );
//   }, [form.jenis_id]);

//   return { 
//     form,
//     isLoading,
//     imageError,
//     setForm,
//     setImageError,
//     handleFieldChange,
//     handlePickImage,
//     handleTakePhoto,
//     handleRemoveImage,
//     handleSubmit,
//     handleDelete,
//     validateForm,
//   };
// };