// import { FormState, Lokasi, LokasiStats, StatusInfo } from '@/components/types/lokasi';
// import { LokasiService, LokasiServiceP2, LokasiServiceP21 } from '@/sample sampah/lokasiService';
// import { useCallback, useEffect, useState } from 'react';
// import { Alert, Platform } from 'react-native';
// import { LocationService } from '../components/services/locationService';

// export interface UseLokasiReturn {
//   data: Lokasi[];
//   loading: boolean;
//   refreshing: boolean;
//   error: string | null;
//   fetchLokasi: () => Promise<void>;
//   onRefresh: () => void;
//   getStatusColor: (kondisi: string) => string;
//   getStatusIcon: (kondisi: string) => string;
//   getStatusLabel: (kondisi: string) => string;
//   formatNumber: (num: number) => string;
//   formatDate: (dateString: string) => string;
//   truncateText: (text: string, maxLength: number) => string;
// }

// export const useLokasi = (): UseLokasiReturn => {
//   const [data, setData] = useState<Lokasi[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchLokasi = useCallback(async (): Promise<void> => {
//     try {
//       setError(null);
//       const lokasiData = await LokasiService.fetchLokasi();
//       setData(lokasiData);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data';
//       setError(errorMessage);
//       console.error('Error in fetchLokasi:', err);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, []);

//   const onRefresh = useCallback((): void => {
//     setRefreshing(true);
//     fetchLokasi();
//   }, [fetchLokasi]);

//   const getStatusColor = useCallback((kondisi: string): string => {
//     switch (kondisi?.toLowerCase()) {
//       case "baik":
//         return "#4CAF50";
//       case "sedang":
//         return "#FF9800";
//       case "buruk":
//         return "#F44336";
//       default:
//         return "#9E9E9E";
//     }
//   }, []);

//   const getStatusIcon = useCallback((kondisi: string): string => {
//     switch (kondisi?.toLowerCase()) {
//       case "baik":
//         return "checkmark-circle";
//       case "sedang":
//         return "alert-circle";
//       case "buruk":
//         return "close-circle";
//       default:
//         return "help-circle";
//     }
//   }, []);

//   const getStatusLabel = useCallback((kondisi: string): string => {
//     switch (kondisi?.toLowerCase()) {
//       case "baik":
//         return "Kondisi Baik";
//       case "sedang":
//         return "Perlu Perhatian";
//       case "buruk":
//         return "Perlu Perbaikan";
//       default:
//         return "Belum Dinilai";
//     }
//   }, []);

//   const formatNumber = useCallback((num: number): string => {
//     if (!num) return "0";
//     return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
//   }, []);

//   const formatDate = useCallback((dateString: string): string => {
//     if (!dateString) return "-";
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('id-ID', {
//         day: '2-digit',
//         month: 'long',
//         year: 'numeric'
//       });
//     } catch {
//       return "-";
//     }
//   }, []);

//   const truncateText = useCallback((text: string, maxLength: number): string => {
//     if (!text) return "Tidak ada deskripsi";
//     if (text.length > maxLength) {
//       return text.substring(0, maxLength) + '...';
//     }
//     return text;
//   }, []);

//   return {
//     data,
//     loading,
//     refreshing,
//     error,
//     fetchLokasi,
//     onRefresh,
//     getStatusColor,
//     getStatusIcon,
//     getStatusLabel,
//     formatNumber,
//     formatDate,
//     truncateText,
//   };
// };

// // pemerintah 
// export interface UseLokasiMonitoringReturn {
//   data: Lokasi[];
//   loading: boolean;
//   refreshing: boolean;
//   error: string | null;
//   stats: LokasiStats;
//   fetchLokasi: () => Promise<void>;
//   onRefresh: () => void;
//   getStatusInfo: (kondisi: string) => StatusInfo;
//   formatNumber: (num: number) => string;
//   formatDate: (dateString: string) => string;
// }

// export const useLokasiMonitoring = (): UseLokasiMonitoringReturn => {
//   const [data, setData] = useState<Lokasi[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Calculate stats whenever data changes
//   const stats: LokasiStats = {
//     totalLokasi: data.length,
//     totalPohon: data.reduce((sum, item) => sum + (item.jumlah || 0), 0),
//     totalLuas: data.reduce((sum, item) => sum + (item.luas_area || 0), 0),
//     kondisiBaik: data.filter(item => item.kondisi?.toLowerCase() === 'baik').length,
//     kondisiSedang: data.filter(item => item.kondisi?.toLowerCase() === 'sedang').length,
//     kondisiBuruk: data.filter(item => item.kondisi?.toLowerCase() === 'buruk').length,
//     lokasiBaik: 0,
//     lokasiSedang: 0,
//     lokasiBuruk: 0
//   };

//   const fetchLokasi = useCallback(async (): Promise<void> => {
//     try {
//       setError(null);
//       const lokasiData = await LokasiService.fetchLokasi();
//       setData(lokasiData);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data';
//       setError(errorMessage);
//       console.error('Error in fetchLokasi:', err);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, []);

//   const onRefresh = useCallback((): void => {
//     setRefreshing(true);
//     fetchLokasi();
//   }, [fetchLokasi]);

//   const getStatusInfo = useCallback((kondisi: string): StatusInfo => {
//     switch (kondisi?.toLowerCase()) {
//       case "baik":
//         return { 
//           color: "#4CAF50",
//           icon: "checkmark-circle" as const
//         };
//       case "sedang":
//         return { 
//           color: "#FF9800",
//           icon: "alert-circle" as const
//         };
//       case "buruk":
//         return { 
//           color: "#F44336",
//           icon: "close-circle" as const
//         };
//       default:
//         return { 
//           color: "#9E9E9E",
//           icon: "help-circle" as const
//         };
//     }
//   }, []);

//   const formatNumber = useCallback((num: number): string => {
//     if (!num && num !== 0) return "0";
//     return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
//   }, []);

//   const formatDate = useCallback((dateString: string): string => {
//     if (!dateString) return "-";
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('id-ID', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric'
//       });
//     } catch {
//       return "Tanggal tidak valid";
//     }
//   }, []);

//   useEffect(() => {
//     fetchLokasi();
//   }, [fetchLokasi]);

//   return {
//     data,
//     loading,
//     refreshing,
//     error,
//     stats,
//     fetchLokasi,
//     onRefresh,
//     getStatusInfo,
//     formatNumber,
//     formatDate,
//   };
// };

// //peneliti
// export interface UseLokasiListReturn {
//   lokasiList: Lokasi[];
//   loading: boolean;
//   error: string | null;
//   fetchLokasi: () => Promise<void>;
//   formatDate: (dateString: string) => string;
//   getStatusColor: (kondisi: string) => string;
//   formatLokasiToFormState: (lokasi: Lokasi) => FormState;
//   createEmptyFormState: () => FormState;
// }

// export const useLokasiList = (): UseLokasiListReturn => {
//   const [lokasiList, setLokasiList] = useState<Lokasi[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchLokasi = useCallback(async (): Promise<void> => {
//     try {
//       setLoading(true);
//       setError(null);
//       const lokasiData = await LokasiService.fetchLokasi();
//       setLokasiList(lokasiData);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data';
//       setError(errorMessage);
//       console.error('Error in fetchLokasi:', err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const formatDate = useCallback((dateString: string): string => {
//     if (!dateString) return "-";
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('id-ID', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric'
//       });
//     } catch {
//       return "Tanggal tidak valid";
//     }
//   }, []);

//   const getStatusColor = useCallback((kondisi: string): string => {
//     switch (kondisi?.toLowerCase()) {
//       case "baik":
//         return "#4CAF50";
//       case "sedang":
//         return "#FF9800";
//       case "buruk":
//         return "#F44336";
//       default:
//         return "#9E9E9E";
//     }
//   }, []);

//   const formatLokasiToFormState = useCallback((lokasi: Lokasi): FormState => {
//     return LokasiServiceP2.formatLokasiToFormState(lokasi);
//   }, []);

//   const createEmptyFormState = useCallback((): FormState => {
//     return LokasiServiceP2.createEmptyFormState();
//   }, []);

//   return {
//     lokasiList,
//     loading,
//     error,
//     fetchLokasi,
//     formatDate,
//     getStatusColor,
//     formatLokasiToFormState,
//     createEmptyFormState,
//   };
// };

// //
// type Mode = "create" | "edit";

// export interface UseLokasiFormReturn {
//   form: FormState;
//   showDatePicker: boolean;
//   isLoading: boolean;
//   setForm: (form: FormState) => void;
//   setShowDatePicker: (show: boolean) => void;
//   handleFieldChange: (field: keyof FormState, value: string | Date | null) => void;
//   handleGetCurrentLocation: () => Promise<void>;
//   handleDateChange: (event: any, date?: Date) => void;
//   handleSubmit: (mode: Mode, onSuccess: () => void) => Promise<void>;
//   handleDelete: (onSuccess: () => void) => Promise<void>;
//   validateForm: () => boolean;
// }

// export const useLokasiForm = (initialForm: FormState): UseLokasiFormReturn => {
//   const [form, setForm] = useState<FormState>(initialForm);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleFieldChange = useCallback((field: keyof FormState, value: string | Date | null) => {
//     setForm(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   }, []);

//   const handleGetCurrentLocation = useCallback(async (): Promise<void> => {
//     try {
//       setIsLoading(true);
//       const location = await LocationService.getCurrentLocation();
//       const coords = LocationService.formatCoordinates(location.latitude, location.longitude);
//       setForm(prev => ({ ...prev, koordinat: coords }));
//       Alert.alert("Sukses", "Koordinat berhasil diambil");
//     } catch (error) {
//       console.error('Error getting location:', error);
//       Alert.alert("Error", error instanceof Error ? error.message : "Gagal mengambil lokasi");
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   const handleDateChange = useCallback((event: any, date?: Date) => {
//     setShowDatePicker(Platform.OS === "ios");
//     if (date) {
//       setForm(prev => ({ ...prev, tanggal_input: date }));
//     }
//   }, []);

//   const validateForm = useCallback((): boolean => {
//     if (!form.nama_lokasi.trim()) {
//       Alert.alert("Error", "Nama lokasi wajib diisi");
//       return false;
//     }

//     if (!form.koordinat.trim()) {
//       Alert.alert("Error", "Koordinat wajib diisi");
//       return false;
//     }

//     // Validate coordinate format
//     const coordRegex = /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/;
//     if (!coordRegex.test(form.koordinat.trim())) {
//       Alert.alert("Error", "Format koordinat tidak valid. Contoh: -6.123456, 106.123456");
//       return false;
//     }

//     return true;
//   }, [form]);

//   const handleSubmit = useCallback(async (mode: Mode, onSuccess: () => void): Promise<void> => {
//     if (!validateForm()) {
//       return;
//     }

//     setIsLoading(true);
    
//     try {
//       const formData = LokasiServiceP21.convertToFormData(form);

//       if (mode === "edit" && form.lokasi_id) {
//         await LokasiServiceP21.updateLokasi(form.lokasi_id, formData);
//         Alert.alert("Sukses", "Lokasi berhasil diperbarui");
//       } else {
//         await LokasiServiceP21.createLokasi(formData);
//         Alert.alert("Sukses", "Lokasi berhasil dibuat");
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
//     if (!form.lokasi_id) return;

//     Alert.alert("Konfirmasi Hapus", "Apakah Anda yakin ingin menghapus lokasi ini?", [
//       { text: "Batal", style: "cancel" },
//       {
//         text: "Hapus",
//         style: "destructive",
//         onPress: async () => {
//           setIsLoading(true);
//           try {
//             await LokasiServiceP21.deleteLokasi(form.lokasi_id!);
//             Alert.alert("Sukses", "Lokasi berhasil dihapus");
//             onSuccess();
//           } catch (error) {
//             console.error('Error deleting lokasi:', error);
//             Alert.alert("Error", error instanceof Error ? error.message : "Gagal menghapus lokasi");
//           } finally {
//             setIsLoading(false);
//           }
//         },
//       },
//     ]);
//   }, [form.lokasi_id]);

//   return {
//     form,
//     showDatePicker,
//     isLoading,
//     setForm,
//     setShowDatePicker,
//     handleFieldChange,
//     handleGetCurrentLocation,
//     handleDateChange,
//     handleSubmit,
//     handleDelete,
//     validateForm,
//   };
// };